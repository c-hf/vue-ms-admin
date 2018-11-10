<template>
    <div class="access">
        <access-information @infoSubmit="infoSubmit"
                            v-if="info" />
        <access-param v-else
                      @setInfo="setInfo"
                      :name="data.name"
                      :custom="custom" />
    </div>
</template>

<script>
import AccessInformation from './information';
import AccessParam from './param';

export default {
	name: 'DeviceAccess',
	data() {
		return {
			info: true,
			custom: false,
			data: {},
		};
	},
	methods: {
		infoSubmit(data, custom) {
			console.log(data);
			this.data = data;
			this.custom = custom;
			this.info = false;
		},
		setInfo() {
			this.info = true;
		},
	},
	components: {
		AccessInformation,
		AccessParam,
	},
};
</script>

<style lang="scss" scoped>
.access {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	padding-bottom: 200px;
}
</style>
