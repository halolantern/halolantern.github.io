new Vue({
	el: ".container",
	data: {
		addressList: [],
		limitNum: 3,
		moreFlag: false,
		currentIndex: 0,
		shippingMethod: 1,
		delFlag: false,
		currentAddress: ''
	},
	mounted: function() {
		this.$nextTick(function() {
			this.getAddressList();
		});
	},
	computed: {
		filterAddress: function() {
			return this.addressList.slice(0, this.limitNum);
		}
	},
	methods: {
		getAddressList: function() {
			var _this = this;
			this.$http.get("data/address.json").then(function(response) {
				var res = response.data;
				if (res.status == "1") {
					_this.addressList = res.result;
				}
			})
		},
		loadMore: function() {
			this.moreFlag = !this.moreFlag;
			if (this.moreFlag) {
			this.limitNum = this.addressList.length;
			}else{
				this.limitNum = 3;
			}
		},
		setDefault: function(addressId) {
			this.addressList.forEach(function(address, index) {
				if (address.addressId === addressId) {
					address.isDefault = true;
				}else{
					address.isDefault = false;
				}
			})
		},
		delConfirm: function(item) {
			this.delFlag = true;
			this.currentAddress = item;
		},
		delAddress: function() {
			var index = this.addressList.indexOf(this.currentAddress);
			this.addressList.splice(index, 1);
			this.delFlag = false;
		}
	}
});