var vm = new Vue({
	el: "#app",
	data: {
		totalMoney: 0,
		productList: [],
		checkAllFlag: false,
		delFlag: false,
		currentProduct:''
	},
	filters: {
		formatMoney: function(value) {
			return "￥" + value.toFixed(2);
		}
	},
	mounted: function() {
		this.$nextTick(function() {
			this.cartView();
		})
	},
	methods: {
		cartView: function() {
			var _this = this;
			this.$http.get("./data/cart.json").then(function(res) {
				console.log(res)
				_this.productList = res.body.result.productList;
			})
		},
		changeMoney: function(product, way) {
			if (way > 0) {
				product.productQuentity++;
			}else{
				product.productQuentity--;
				if (product.productQuentity<1) {
					product.productQuentity = 1;
				}
			}
			this.calcTotalPrice();
		},
		selectedProduct: function(item) {
			if (typeof(item.checked) === 'undefined') {
				this.$set(item, 'checked', true);
			}else {
				item.checked = !item.checked;
				if (!item.checked) {
					this.checkAllFlag = false;
				}
			}
			this.calcTotalPrice();
		},
		checkAll: function(flag) {
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function(item, index) {
				if (typeof(item.checked) === 'undefined') {
					_this.$set(item, 'checked', _this.checkAllFlag);
				}else{
					item.checked = _this.checkAllFlag;
				}
			});
			this.calcTotalPrice();
		},
		calcTotalPrice: function() {
			var _this = this;
			this.totalMoney = 0;
			this.productList.forEach(function(item, index) {
				if (item.checked) {
					_this.totalMoney += item.productPrice*item.productQuentity;
				}
			});
		},
		delConfirm: function(item) {
			this.delFlag = true;
			this.currentProduct = item;
		},
		delProduct: function() {
			var index = this.productList.indexOf(this.currentProduct);
			this.productList.splice(index, 1);
			this.delFlag = false;
		}
	}
});