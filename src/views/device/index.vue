<template>
    <div class="device">
        Device
        <router-view />
    </div>
</template>

<script>
export default {
	name: 'Device', // 设备概览
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.device {
	width: 100%;
	position: relative;
}
</style>
