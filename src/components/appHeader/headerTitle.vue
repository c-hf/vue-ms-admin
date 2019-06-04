<template>
    <div class="app-header-title">
        <span class="border">
            <i class="el-icon-date"></i>
            {{ currentDate }}
        </span>
        <span class="border">
            <i class=" el-icon-time"></i>
            {{ currentTime }}
        </span>
        <span v-if="weather.city.length < 4">
            <svg-icon class="view-weather-icon"
                      :iconClass="weather.icon" />
            &nbsp;{{ weather.city }}&nbsp;
            {{ weather.temperature }}&#8451;
        </span>
        <el-tooltip v-else
                    effect="dark"
                    :content="`${weather.city} ${weather.temperature}℃`"
                    placement="bottom">
            <span>
                <svg-icon class="view-weather-icon"
                          :iconClass="weather.icon" />
                &nbsp;{{ weather.city }}&nbsp;
                {{ weather.temperature }}&#8451;
            </span>
        </el-tooltip>
    </div>
</template>

<script>
import { WEATHERICON } from '@/config';

export default {
	name: 'AppHeaderTitle',
	data() {
		return {
			currentTime: '',
			currentDate: '',
			weatherIcon: WEATHERICON,
			data: {
				province: '北京',
				adcode: '110101',
				city: '东城区',
				weather: '未知',
				icon: 'icon-unknown',
				humidity: '0',
				temperature: '0',
				winddirection: '北',
				windpower: '0',
				reporttime: '2018-12-23 18:00:00',
			},
		};
	},

	computed: {
		weather() {
			if (!this.$store.state.weather.adcode) {
				return {
					province: '北京',
					adcode: '110101',
					city: '东城区',
					weather: '未知',
					icon: 'icon-unknown',
					humidity: '0',
					temperature: '0',
					winddirection: '北',
					windpower: '0',
					reporttime: '2018-12-23 18:00:00',
				};
			}
			return this.$store.state.weather;
		},
	},

	methods: {
		getCurrentDate(date) {
			let [Y, M, D, W] = [
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate(),
				date.getDay(),
			];

			const Week = {
				'1': '一',
				'2': '二',
				'3': '三',
				'4': '四',
				'5': '五',
				'6': '六',
				'0': '日',
			};
			W = Week[W];
			return `${Y}-${M}-${D} 星期${W}`;
		},

		// 时间
		getCurrentTime(date) {
			let [time, indicate] = [
				[date.getHours(), date.getMinutes(), date.getSeconds()],
				'AM',
			];

			time.forEach((el, index) => {
				if (el < 10) {
					time[index] = '0' + el;
				}
			});
			if (time[0] > 12) {
				indicate = 'PM';
			} else {
				indicate = 'AM';
			}

			return `${time.join(' : ')} ${indicate}`;
		},
	},

	mounted() {
		// 页面加载完后显示当前时间
		this.currentTime = this.getCurrentTime(new Date());
		this.currentDate = this.getCurrentDate(new Date());
		// 定时器
		this.timer = setInterval(() => {
			this.currentTime = this.getCurrentTime(new Date()); // 修改数据date
		}, 1000);
	},
};
</script>

<style lang="scss" scoped>
.app-header-title {
	width: 360px;
	background: none repeat scroll 0 0 rgba(0, 0, 0, 0.01);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 30px;
	box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1) inset;
	color: #909399;
	margin: 6px;
	padding: 6px 20px;
	font-size: 12px;

	span {
		padding: 0 5px;
	}

	.border {
		border-right: 1px solid #e4e7ed;
		box-shadow: 1px 0 0 rgba(255, 255, 255, 0.1);
	}
}
</style>

