	const blockedDates = () =>{
		fetchOrders().then(({data})=>{
			let dates =  {};
			let blockedDates = {};
			data.data.forEach(order=>{
				if (!order.shippingDate) return;
				if(dates[order.shippingDate]){
					dates[order.shippingDate] += 1;
					if (dates[order.shippingDate] >= 3) {
						blockedDates[order.shippingDate] = true;
					}
					return;
				}
				return dates[order.shippingDate] = 1;
			});
			console.log(blockedDates);
			return blockedDates;
		});
	}			blockedDates:blockedDates(),


		const validateShippingDate = date =>{
		if (date) {
			if ($scope.data.blockedDates[date]) {
				errHnadler('Shipping Date Is Full. Please Pick Another Date.', 'blockedDates');
				return false;
			}
			return true;
		}
		return false;
	}