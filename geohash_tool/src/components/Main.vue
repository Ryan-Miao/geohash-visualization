<template>
    <div class="map_container">
        <div class="ui_container">
            <el-row>
                <el-col :span="10">
                    <div class="option_input_label">geohash位数:</div>
                </el-col>
                <el-col :span="14">
                    <el-input v-model="geohash_precision" placeholder="geohash位数精度"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :span="24">
                    <div>点击地图时标记选项：</div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 5px;">
                <el-col :span="12">
                    <el-radio v-model="labelType" label="1" class="option_radio_style">标注点击区域</el-radio>
                </el-col>
                <el-col :span="12">
                    <el-radio v-model="labelType" label="2" class="option_radio_style">标注相邻9区域</el-radio>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :span="24">
                    <div>点击地图时添加删除选项：</div>
                </el-col>
            </el-row>
            <el-row style="margin-top: 5px;">
                <el-col :span="12">
                    <el-radio v-model="addRemoveType" label="1" class="option_radio_style">点击时添加</el-radio>
                </el-col>
                <el-col :span="12">
                    <el-radio v-model="addRemoveType" label="2" class="option_radio_style">点击时删除</el-radio>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :span="24">
                    <el-button @click="clearMarker()">清除标注块</el-button>
                </el-col>
            </el-row>
        </div>
        <div id="mapDiv" class="mapStyle"></div>
    </div>
</template>

<script>
import AMap from 'AMap';
import Geohash from 'latlon-geohash';

export default {
    data() {
        return {
            map: undefined,
            geohash_precision: 6,
            // rects: [],
            // labels: [],
            // labelCodes: [],
            markers: {},
            // 1：仅标注当前块。2：标注当前已经周边共计9块
            labelType: '1',
            // 1:添加 2：删除
            addRemoveType: '1'
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            this.map = new AMap.Map('mapDiv', {
                center                              : [114.085947, 22.547], //中心点 深圳
                // center                              : [116.397428, 39.90923], //中心点 北京
                zoom                                : 15, //地图层级
                rotateEnable                        : false, // 不可旋转
                dragEnable                          : true // 不可拖拽。和报告的翻页冲突
            });

            this.map.on('complete', () => {
                console.log('map has loaded');
                // this.getExcelData('excel_data3.xlsx');
            });
            this.map.on('click', this.mapClick);
        },
        mapClick(e) {
            // this.clearGeohashRect();
            // this.clearLabel();
            let lon = e.lnglat.lng;
            let lat = e.lnglat.lat;
            console.log('map click. lng:', lon, ', lat:', lat);
            // let geohashCode = Geohash.encode(lon, lat, 9);
            let precision = this.geohash_precision;
            if (typeof(precision) == 'string') {
                precision = parseInt(precision);
            }
            let geohashCode = Geohash.encode(lat, lon, precision);
            console.log(geohashCode);
            if (this.addRemoveType == '1') {
                this.markerGeohash(geohashCode);
                if (this.labelType == '2') {
                    let neighboursCode = Geohash.neighbours(geohashCode);
                    console.log('neighboursCode:', neighboursCode);
                    for (let key in neighboursCode) {
                        this.markerGeohash(neighboursCode[key]);
                    }
                }
            }
            else {
                // this.removeMarker(geohashCode);
            }
        },
        rectClick(e) {
            // console.log('Rectangle click:', e);
            let geohashCode = e.target.getExtData();
            console.log('rectClick:', geohashCode);

            if (this.addRemoveType == '2') {
                this.removeMarker(geohashCode);
            }
        },
        labelClick(e) {
            let geohashCode = e.target.getExtData();
            console.log('getExtData:', geohashCode);
            if (this.addRemoveType == '2') {
                this.removeMarker(geohashCode);
            }
        },
        markerGeohash(geohashCode) {
            if (this.markers.hasOwnProperty(geohashCode)) {
                return;
            }

            let bounds = Geohash.bounds(geohashCode);
            console.log('bounds:', bounds);
            let southWest = new AMap.LngLat(bounds.sw.lon, bounds.sw.lat, true);
            let northEast = new AMap.LngLat(bounds.ne.lon, bounds.ne.lat, true);
            let amapBound = new AMap.Bounds(southWest, northEast);
            let boundRect = new AMap.Rectangle({
                map: this.map,
                zIndex: 10,
                bounds: amapBound,
                strokeColor: '#00FFFF',
                strokeOpacity: 0.9,
                strokeWeight: 1,
                fillColor: '#FFFF00',
                fillOpacity: 0.5,
                strokeStyle: 'solid',
                bubble: true,
                extData: geohashCode
            });
            boundRect.on('click', this.rectClick);

            const lonlat = Geohash.decode(geohashCode);
            let position = new AMap.LngLat(lonlat.lon, lonlat.lat, true);
            let textLabel = new AMap.Text({
                map: this.map,
                text: geohashCode,
                position: position,
                anchor: 'center',
                zIndex: 5,
                extData: geohashCode
            });
            textLabel.on('click', this.labelClick);

            this.markers[geohashCode] = {
                rect: boundRect,
                label: textLabel
            };
        },
        removeMarker(geohashCode) {
            if (!this.markers.hasOwnProperty(geohashCode)) {
                return;
            }
            let item = this.markers[geohashCode];
            item.rect.setMap(null);
            item.label.setMap(null);
            delete this.markers[geohashCode];
        },
        clearMarker() {
            for (let key in this.markers) {
                let item = this.markers[key];
                item.rect.setMap(null);
                item.label.setMap(null);
            }
            this.markers = {};
        }
    }
}
</script>

<style>
.map_container {
    position: relative;
    width: 100%;
    height: 100%;
}
.ui_container {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 10px 15px 0 rgba(136, 141, 152, 0.16);
    padding: 4px 16px 4px 16px;
    width: 250px;
}
.mapStyle {
    position: relative;
    width: 100%;
    height: 100%;
}
.option_input_label {
    /* float: left; */
    text-align: left;
    line-height: 40px;
    margin: 0;
    color: #222;
    font-size: 15px;
    font-weight: 500;
}
.option_input_content {
    float: left;
    width: 60%;
}
.option_radio_container {
    position: relative;
    width: 100%;
    margin: 20px 0 20px 0;
}
.option_radio_style {
    /* float: left; */
    /* width: 35%; */
    position: relative;
}
.option_divider {
    position: relative;
}
</style>