<template>
    <div class="scroll">
        <span class="scroll-bar"></span>
    </div>
</template>

<script>
export default {
	name: 'scroll',
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.scroll {
	position: absolute;
	right: 3px;
	width: 8px;
	border-radius: 4px;
	opacity: 0;
	display: block;
	background-color: transparent;
	transition: background-color 0.2s linear, opacity 0.2s linear;

	&-bar {
		width: 6px;
		position: absolute;
		right: 2px;
		border-radius: 6px;
		background-color: rgba(0, 0, 0, 0.2);
		transition: background-color 0.2s linear, height 0.2s linear,
			width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
	}
}
</style>
