import storage from '@/assets/js/storage';

export default {
	// 更新本地缓存
	updateLocalStorage: update => {
		update.contents = update.contents || {};
		update.contents[update.id] = {};
		update.contents[update.id].data = update.data;
		update.contents[update.id].updateTime = update.curTime;
		storage.set(update.key, update.contents);
	},

	// 设置 options
	setOptions(data) {
		let options = [];
		data.forEach(el => {
			let optionItem = {};
			optionItem.value = el.categoryId;
			optionItem.label = el.name;
			optionItem.children = [];
			el.categoryItem.forEach(el => {
				let childrenItem = {};
				childrenItem.value = el.categoryItemId;
				childrenItem.label = el.name;
				optionItem.children.push(childrenItem);
			});
			options.push(optionItem);
		});
		return options;
	},
};
