(function(global) {
	var aamViewModel,
		app = global.app = global.app || {};

	aamViewModel = kendo.data.ObservableObject.extend({
		mode: null,
		aamDataSource: null,
		jobAAMDatasource: null,
		jobAAMId: null,
		articleType: null,
		serailInput: null,
		articleCriteria: null,
		newAAMItem: null, //data item of Crate new AAM Document
		searchCriteria: null, //data item from Form Search Location Store for data-init event in gotoSearchResult 
		siteAccessItem: null, //data item from ddlSiteAccess Selected for clone for locationform,to with document type
		docDetailList: null, //data items of Equipment detail
		docDetailItem: null, //data item for push to docDetailList
		//serialNoList: null, //data items of serialNo (Barcode)
		//serialNoItem: null, //data item for push to serialNoList
		isRet: false, //data value of locationform,to with document type(Return)
		isWid: true, //data value of locationform,to with document type(Withdraw)
		Fddl: false,
		companyOwnerList: null,
		seviceGroupList: null,
		tmpEqDatasource: null,
		selectJobAAMItem: null,
		companyOwnerName: null,
		serviceGroupName: null,
		_canEdit: null,
		_isLoading: true,
		addDocDetail: function() {

			var docDetailItem = app.aamService.viewModel.get("docDetailItem");
			var newAAMItem = app.aamService.viewModel.get("newAAMItem");
			//console.log('docDetailItem:::' + JSON.stringify(docDetailItem));
			if (docDetailItem.requestQty > docDetailItem.totalQty) {
				//console.log("Request Qty more than Total Qty !");
				navigator.notification.alert("Request Qty more than Total Qty !",
					function() {}, "AAM : ", 'OK');
			} else if (docDetailItem.requestQty <= 0) {
				//console.log("Request Qty less than zero !");
				navigator.notification.alert("Request Qty must greater than 0 !",
					function() {}, "AAM : ", 'OK');
			} else {
				newAAMItem.docDetailList.push({
					"articleDesc": docDetailItem.articleDesc,
					"articleGroup": docDetailItem.articleGroup,
					"articleGroupId": docDetailItem.articleGroupId,
					"articleId": docDetailItem.articleId,
					"articleNo": docDetailItem.articleNo,
					"articleType": docDetailItem.articleType,
					"reqSrNo": docDetailItem.reqSrNo,
					"requestQty": docDetailItem.requestQty,
					"seq": 0,
					"serialNoList": docDetailItem.serialNoList
				});
				app.application.navigate(
					"#AAM"
				);
			}
		},

		checkSerailNo: function(sn) {
			app.application.showLoading();

			var found_sn = null;
			var dataSN = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						var that = app.aamService.viewModel;
						var newAAMItem = that.get('newAAMItem');
						var docDetailItem = that.get('docDetailItem');

						var dataValue = {
							"token": localStorage.getItem("token"),
							"userId": JSON.parse(localStorage.getItem("profileData")).userId,
							"fromLocationTypeId": newAAMItem.fromLocationTypeId,
							"fromOrgLocationId": newAAMItem.fromOrgLocationId,
							"fromSiteCode": newAAMItem.fromSiteCode,
							"companyOwnerId": newAAMItem.companyOwnerId,
							"serviceGroupId": newAAMItem.serviceGroupId,
							"transferStatus": newAAMItem.transferType,
							"articleType": docDetailItem.articleType,
							"articleGroupId": docDetailItem.articleGroupId,
							"articleNo": docDetailItem.articleId
						};
						//console.log('getSerialNoInfo : ' + JSON.stringify(dataValue));
						//alert('getSerialNoInfo : ' + JSON.stringify(dataValue));
						$.ajax({
							beforeSend: app.loginService.viewModel.checkOnline,
							url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getSerialNoInfo.json",
							type: "POST", timeout: 180000,
							data: JSON.stringify(dataValue),
							dataType: "json",
							contentType: 'application/json',
							async: false,
							success: function(response) {
								//console.log('getSerialNoInfo : success : ' + JSON.stringify(response.resultInfo));

								$.each(response.resultInfo, function(index, item) {
									$.each(item.serialNoList, function(indexSerialNo, itemSerialNo) {
										if (itemSerialNo.serialNo == sn) {
											found_sn = itemSerialNo.sid;
										}
									});
								});
								app.application.hideLoading();
								operation.success(response.resultInfo);
							},
							error: function(xhr, error) {
								//console.log('##### getSerialNoInfo load data fail!');
								location = '#';
								return;
							}
						});
					}
				}
			});
			dataSN.read();
			return found_sn;
		},

		addSerailNo: function() {
			var docDetailItem = this.get("docDetailItem");

			if (this.get("serailInput") != null && this.get("serailInput") != "") {
				var sid = this.checkSerailNo(this.get("serailInput"));
				var cDup = false;
				if (sid != null) {
					//var docDetailItem = this.get("docDetailItem");
					$.each(docDetailItem.serialNoList, function(i, item) {
						if (sid == item.sid) cDup = true;
					});
					if (docDetailItem.requestQty == docDetailItem.totalQty) {
						//alert('Quantity exceed. Maximum is ' + docDetailItem.totalQty);
						navigator.notification.alert('Quantity exceed. Maximum is ' + docDetailItem.totalQty,
							function() {}, "AAM : ", 'OK');
					} else if (cDup) {
						//alert('Barcode duplicate! Please try again.');
						navigator.notification.alert('Barcode duplicate! Please try again.',
							function() {}, "AAM : ", 'OK');
					} else {
						docDetailItem.serialNoList.push({
							"serialNo": this.get("serailInput"),
							"sid": sid
						});
						docDetailItem.requestQty = docDetailItem.serialNoList.length;
						//console.log('' + JSON.stringify(docDetailItem.requestQty));
					}
				} else {
					//alert('Barcode not found! Please try again.');
					navigator.notification.alert('Barcode not found! Please try again.',
						function() {}, "AAM : ", 'OK');
				}
			}

			//console.log('' + JSON.stringify(docDetailItem));
			this.set("serailInput", null);
			kendo.bind($(".refresh"), docDetailItem, kendo.mobile.ui);

		},
		showLoading: function() {
			//if (this._isLoading) {
				app.application.showLoading();
				//}
		},
		detailInit: function() {
			//console.log("detailInit");
			/*
            this.set("docDetailItem", null)
            var docDetailItem = this.set("docDetailItem", {
            "articleDesc": "OPTICAL REPEATERB MASTER",
            "articleGroup": "BASE STATION->REPEATER",
            "articleGroupId": "005",
            "articleId": "ART4003098",
            "articleNo": "GZF900-IIIA",
            "articleType": "E",
            "reqSrNo": false,
            "totalQty": 10,
            "requestQty": 0,
            "seq": 1,
            "serialNoList": []
            });
            
            */

			/*
            $("#lvSerailNoList").kendoMobileListView({
            dataSource: docDetailItem.serialNoList,
            style: "inset",
            template: $("#lvSerailNoList-template").html(),
            pullToRefresh: true,
            dataBound: function () {
                    
            }
            });
            */
		},
		hideLoading: function() {
			app.application.hideLoading();
		},
		onRegionSelect: function(e) { //event selected of ddlregionId
			var dataItem = e.sender.dataItem(e.item.index());
			var searchCriteria = this.get('searchCriteria');
			searchCriteria.regionId = dataItem.id;
			//console.log('' + JSON.stringify(this.get("searchCriteria")));

			//this.get('searchCriteria');
			searchCriteria.zoneId = "";
			searchCriteria.provinceId = "";
			this.set('searchCriteria', searchCriteria);
			this.loadZone();
			this.loadProvince();
			$('#ddlzoneId').data("kendoDropDownList").value('');
			$('#ddlprovinceId').data("kendoDropDownList").value('');
		},
		onZoneSelect: function(e) { //event selected of ddlzoneId
			var dataItem = e.sender.dataItem(e.item.index());
			var searchCriteria = this.get('searchCriteria');
			searchCriteria.zoneId = dataItem.id;
			searchCriteria.provinceId = "";
			this.set('searchCriteria', searchCriteria);
			//console.log('' + JSON.stringify(this.get("searchCriteria")));
			this.loadProvince();
			$('#ddlprovinceId').data("kendoDropDownList").value('');

		},
		onProvinceSelect: function(e) { //event selected of ddlprovinceId
			var dataItem = e.sender.dataItem(e.item.index());
			var searchCriteria = this.get('searchCriteria');
			searchCriteria.provinceId = dataItem.id;
			//console.log('' + JSON.stringify(this.get("searchCriteria")));
		},
		gotoSearchResult: function() { //event summited button of Form Search Location(#searchForm)
			//console.log("searchCriteria :" + JSON.stringify(this.get("searchCriteria")));
			app.application.navigate(
				'#site'
			);
		},
		gotoEQSearchResult: function() {
			app.application.navigate(
				'#equipment'
			);
		},
		gotosearchForm: function() {
			app.application.navigate(
				'#searchForm'
			);
			
			$("#ul_aam_selectLocType").data("kendoMobileButtonGroup").select(0);
		},

		deleteAAM_equipment: function(id) {
			var docDetailItem = this.get("docDetailItem");
			var newAAMItem = this.get("newAAMItem");
			//console.log('deleteAAM_equipment :::::::::: ' + JSON.stringify(newAAMItem.docDetailList));

			navigator.notification.confirm(
				'Confirm to Delete!', // message

				function(buttonIndex) {
					if (buttonIndex == 2) {
						$.each(newAAMItem.docDetailList, function(i) {
							if (newAAMItem.docDetailList[i].articleId == id) {
								newAAMItem.docDetailList.splice(i, 1);
								return false;
							}
						});
					}
				}, // callback to invoke with index of button pressed
				'Confirm', // title
				'Cancel,OK' // buttonLabels
			);
			//console.log('deleteAAM_equipment :::::::::: ' + JSON.stringify(newAAMItem.docDetailList));

		},
		deleteAAM_equipment_all: function() {
			var docDetailItem = app.aamService.viewModel.get("docDetailItem");
			var newAAMItem = app.aamService.viewModel.get("newAAMItem");
			if (docDetailItem != null) {
				//console.log('deleteAAM_equipment_all :::::::::: ' + JSON.stringify(newAAMItem.docDetailList));

				$.each(newAAMItem.docDetailList, function(i) {
					newAAMItem.docDetailList.splice(i, 1);
				});

				//console.log('deleteAAM_equipment_all :::::::::: ' + JSON.stringify(newAAMItem.docDetailList));
			}

			if (typeof $('#ddlregionId').data("kendoDropDownList") !== "undefined") {
				$('#ddlregionId').data("kendoDropDownList").value('');
			}
			if (typeof $('#ddlzoneId').data("kendoDropDownList") !== "undefined") {
				var ddlzoneId = $('#ddlzoneId').data("kendoDropDownList");
				ddlzoneId.setDataSource([]);
				ddlzoneId.text('');
			}
			if (typeof $('#ddlprovinceId').data("kendoDropDownList") !== "undefined") {
				var ddlprovinceId = $('#ddlprovinceId').data("kendoDropDownList");
				ddlprovinceId.setDataSource([]);
				ddlprovinceId.text('');
			}

			var searchCriteria = app.aamService.viewModel.get('searchCriteria');
			searchCriteria.locationCode = '';
			searchCriteria.siteCode = '';
			kendo.bind($(".reset_searchCriteria"), searchCriteria, kendo.mobile.ui);
		},
		deleteAAM_doc: function() {
			navigator.notification.confirm(
				'Confirm to Delete!', // message

				function(buttonIndex) {
					if (buttonIndex == 2) {
						var dataValue = {
							"token": localStorage.getItem("token"),
							"documentNo": app.aamService.viewModel.get('selectJobAAMItem').aamId,
							"userName": app.aamService.viewModel.get('selectJobAAMItem').adminZone,
							"userId": JSON.parse(localStorage.getItem("profileData")).userId
						};
						//console.log('deleteAAM_doc :::::: ' + JSON.stringify(dataValue));
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=deleteDoc.json',
							data: JSON.stringify(dataValue),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								////console.log(JSON.stringify(response));
								//console.log("'deleteAAM_doc :::::: Response :" + JSON.stringify(response));
								if (response.responseStatus == "ERROR_ALL") {
									//alert(response.resultInfo[0].statusMsg);
									navigator.notification.alert(response.resultInfo[0].statusMsg,
										function() {}, "AAM : ", 'OK');

								}
								if (response.responseStatus == "SUCCESS") {
									//alert(response.responseStatus);
									navigator.notification.alert(response.responseStatus,
										function() {}, "AAM : ", 'OK');
									app.application.navigate(
										"#tabstrip-edit"
									);

								}

							},
							error: function(xhr, error) {
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get deleteDoc failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get deleteDoc failed", 'OK');
										return;
									}
								}
							}
						});
					}
				}, // callback to invoke with index of button pressed
				'Confirm', // title
				'Cancel,OK' // buttonLabels
			);
		},
		deleteAAM_serial: function(id) {
			var docDetailItem = this.get("docDetailItem");
			//var newAAMItem = this.get("newAAMItem");

			//console.log('deleteAAM_serial ::' + id + ':::::::: ' + JSON.stringify(docDetailItem));

			$.each(docDetailItem.serialNoList, function(i, item) {
				if (item.sid == id) {
					if (confirm('Confirm to Delete!')) {
						docDetailItem.serialNoList.splice(i, 1);
						docDetailItem.requestQty = docDetailItem.serialNoList.length;
						return false;
					}
				}
			});
			kendo.bind($(".refresh"), docDetailItem, kendo.mobile.ui);
			//console.log('deleteAAM_serial :::::::::: ' + JSON.stringify(docDetailItem));
		},

		checkTab_material: function(isShow) {
			if (isShow) {
				$('.tab_material_newAAM').css('display', '');
				$('.tab_equipment_newAAM').css('border-right-color', '#c9db31');
				$('.tab_equipment_newAAM').css('border-right-width', '0px');
			} else {
				$('.tab_material_newAAM').css('display', 'none');
				$('.tab_equipment_newAAM').css('border-right-color', '#c9db31');
				$('.tab_equipment_newAAM').css('border-right-width', '1px');
			}
		},
		eqSelected: function(e) {
			var that = app.aamService.viewModel;
			var newAAMItem = that.get("newAAMItem");
			//console.log('newAAMItem ::::: ' + JSON.stringify(newAAMItem.docDetailList));
			//console.log('e.dataItem ::: ' + e.dataItem);
			if (typeof e.dataItem !== "undefined") {
				var itemUID = e.dataItem.uid;
				that.set("docDetailItem", {
					"articleDesc": e.dataItem.articleDescription,
					"articleGroup": e.dataItem.groupName,
					"articleGroupId": e.dataItem.groupId,
					"articleId": e.dataItem.articleId,
					"articleNo": e.dataItem.articleNo,
					"articleType": app.aamService.viewModel.get("articleCriteria").articleType,
					"reqSrNo": e.dataItem.reqSrNo,
					"totalQty": e.dataItem.totalQty,
					"requestQty": 0,
					"seq": 1, //???
					"serialNoList": []
				});


				//$("#input_reqty").kendoNumericTextBox({
				//    max: docDetailItem.totalQty,
				//    value: docDetailItem.requestQty,
				//    format: "n0",
				//    min: 0
				//});

				kendo.bind($(".refresh"), that.get("docDetailItem"), kendo.mobile.ui);

				//console.log('eqSelected :::: ' + JSON.stringify(that.get("docDetailItem")));

				app.application.navigate(
					"#equipmentDtl"
				);
			} else {
				//console.log('e.dataItem ::: ' + e.dataItem);
			}

		},
		locSelected: function(e) { //event selecte of Location Store Listview (#ulLocation)
			//console.log('e dataItem: ' + JSON.stringify(e.dataItem));
			if (typeof e.dataItem !== "undefined") {
				var that = app.aamService.viewModel;
				var newAAMItem = that.get('newAAMItem');
				var searchCriteria = that.get('searchCriteria');
				if (that.get('isRet')) {
					newAAMItem.toOrgLocationId = e.dataItem.locationId;
					newAAMItem.toSiteCode = e.dataItem.siteCode;
					newAAMItem.toLocationTypeId = searchCriteria.locationType;
					newAAMItem.zoneTo = e.dataItem.zoneName;
					newAAMItem.regionTo = e.dataItem.regionName;

				} else {
					newAAMItem.fromOrgLocationId = e.dataItem.locationId;
					newAAMItem.fromSiteCode = e.dataItem.siteCode;
					newAAMItem.fromLocationTypeId = searchCriteria.locationType;
					newAAMItem.zoneFrom = e.dataItem.zoneName;
					newAAMItem.regionFrom = e.dataItem.regionName;

				}

				//console.log('' + JSON.stringify(that.get("newAAMItem")));

				if ($("#ulLocation").data("kendoMobileListView") != undefined && $("#ulLocation").data("kendoMobileListView") != null) {
					$("#ulLocation").data("kendoMobileListView").destroy();
				}
				app.application.navigate(
					'#AAM'
				);
			} else {
				//console.log('e item: ' + JSON.stringify(e.dataItem));
			}
		},
		onSelectSite: function(e) { //Event Selected of ddlSiteAccess 
			//reset art---------------
			app.aamService.viewModel.deleteAAM_equipment_all();

			var dataItem = e.sender.dataItem(e.item.index());
			var siteAccessItem = this.get('siteAccessItem');
			var newAAMItem = this.get('newAAMItem');
			if (dataItem != null && e.item.index() != 0) {
				this.set("isSiteSelected", true);
				$("#div_aam_checkAAMDetail").hide();
			} else {
				this.set("isSiteSelected", false);
				$("#div_aam_checkAAMDetail").show();
			}
			siteAccessItem.siteId = dataItem.siteId;
			siteAccessItem.siteCode = dataItem.siteCode;
			siteAccessItem.locationCode = dataItem.locationCode;
			siteAccessItem.siteCodeDesc = dataItem.siteCodeDesc;
			siteAccessItem.regionId = dataItem.regionId;
			siteAccessItem.regionName = dataItem.regionName;
			siteAccessItem.zoneId = dataItem.zoneId;
			siteAccessItem.zoneName = dataItem.zoneName;
			this.set("siteAccessItem", siteAccessItem);

			newAAMItem.siteAccessId = dataItem.siteId;
			if (this.get('isWid')) {
				//witdraw
				newAAMItem.toLocationTypeId = "001";
				newAAMItem.toOrgLocationId = siteAccessItem.locationCode;
				newAAMItem.toSiteCode = siteAccessItem.siteCode;
				newAAMItem.zoneTo = siteAccessItem.zoneName;
				newAAMItem.regionTo = siteAccessItem.regionName;

				newAAMItem.fromLocationTypeId = "";
				newAAMItem.fromOrgLocationId = "";
				newAAMItem.fromSiteCode = "";
				newAAMItem.zoneFrom = "";
				newAAMItem.regionFrom = "";

			} else {
				//return
				newAAMItem.fromLocationTypeId = "003";
				newAAMItem.fromOrgLocationId = siteAccessItem.locationCode;
				newAAMItem.fromSiteCode = siteAccessItem.siteCode;
				newAAMItem.zoneFrom = siteAccessItem.zoneName;
				newAAMItem.regionFrom = siteAccessItem.regionName;

				newAAMItem.toLocationTypeId = "";
				newAAMItem.toOrgLocationId = "";
				newAAMItem.toSiteCode = "";
				newAAMItem.zoneTo = "";
				newAAMItem.regionTo = "";

			}
			//console.log('Site Selected:' + JSON.stringify(this.get("siteAccessItem")));
			kendo.bind($(".locate"), newAAMItem, kendo.mobile.ui);
		},
		onSelectSvc: function(e) { //event selected of Service group (ddlServiceGroup)
			var dataItem = e.sender.dataItem(e.item.index());
			var newAAMItem = this.get('newAAMItem');
			newAAMItem.serviceGroupId = dataItem.serviceId;
			//console.log('' + JSON.stringify(this.get("newAAMItem")));
		},
		onSelectAdmin: function(e) { //event selected of AdminZone (ddlAdmin)
			var dataItem = e.sender.dataItem(e.item.index());
			var newAAMItem = this.get('newAAMItem');
			newAAMItem.userName = dataItem.userName;
			//console.log('' + JSON.stringify(this.get("newAAMItem")));
		},
		onSelectComp: function(e) { //event selected of CompanyOwner (ddlCompany)
			var dataItem = e.sender.dataItem(e.item.index());
			var newAAMItem = this.get('newAAMItem');
			newAAMItem.companyOwnerId = dataItem.companyCode;
			newAAMItem.transferType = dataItem.transferType;
			//console.log('' + JSON.stringify(this.get("newAAMItem")));
		},
		onLocTypeSelect: function(e) { //event selected of button group LocationType in Form Search Location
			var buttonGroup = e.sender;
			var index = buttonGroup.current().index();
			//console.log('index:' + index);
			var searchCriteria = this.get('searchCriteria');
			if (index == 0) {
				searchCriteria.locationType = "001";
				this.checkTab_material(false);
			} else {
				searchCriteria.locationType = "003";
				if (this.get('isWid')) this.checkTab_material(true);
				else this.checkTab_material(false);
			}

			//console.log('searchCriteria :::: ' + JSON.stringify(this.get("searchCriteria")));
		},
		locationType_check: function(type) {
			$("#ul_aam_selectLocType").kendoMobileButtonGroup();
			var searchCriteria = this.get('searchCriteria');
			//console.log(JSON.stringify(searchCriteria));
			var buttongroup = $("#ul_aam_selectLocType").data("kendoMobileButtonGroup");
			if (type == 0) {
				$('#li_aam_location').show();
				buttongroup.select(0);
				searchCriteria.locationType = "001";
			} else {
				$('#li_aam_location').hide();
				buttongroup.select(1);
				searchCriteria.locationType = "003";
			}
		},
		onTypeSelect: function(e) { //event selected of Button Group (Withdraw/Return)
			var buttonGroup = e.sender;
			var index = buttonGroup.current().index();
			//console.log('index:' + index);
			var siteAccessItem = this.get('siteAccessItem');
			//console.log('Site Selected:' + JSON.stringify(this.get("siteAccessItem")));
			var newAAMItem = this.get('newAAMItem');
			if (index == 0) {
				//witdraw
				newAAMItem.toLocationTypeId = "001";
				newAAMItem.toOrgLocationId = siteAccessItem.locationCode;
				newAAMItem.toSiteCode = siteAccessItem.siteCode;
				newAAMItem.zoneTo = siteAccessItem.zoneName;
				newAAMItem.regionTo = siteAccessItem.regionName;

				newAAMItem.fromLocationTypeId = "";
				newAAMItem.fromOrgLocationId = "";
				newAAMItem.fromSiteCode = "";
				newAAMItem.zoneFrom = "";
				newAAMItem.regionFrom = "";

				this.locationType_check(0);

				newAAMItem.documentType = "WITHDRAW";
				if (this.get('searchCriteria') == null || this.get('searchCriteria').locationType == "001") {
					this.checkTab_material(false);
				} else {
					this.checkTab_material(true);
				}

				this.set("isWid", true);
				this.set("isRet", false);
			} else {
				//return
				newAAMItem.fromLocationTypeId = "001";
				newAAMItem.fromOrgLocationId = siteAccessItem.locationCode;
				newAAMItem.fromSiteCode = siteAccessItem.siteCode;
				newAAMItem.zoneFrom = siteAccessItem.zoneName;
				newAAMItem.regionFrom = siteAccessItem.regionName;

				newAAMItem.toLocationTypeId = "";
				newAAMItem.toOrgLocationId = "";
				newAAMItem.toSiteCode = "";
				newAAMItem.zoneTo = "";
				newAAMItem.regionTo = "";

				this.locationType_check(1);

				newAAMItem.documentType = "RETURN";
				this.checkTab_material(false);

				this.set("isWid", false);
				this.set("isRet", true);

			}
			kendo.bind($(".locate"), newAAMItem, kendo.mobile.ui);
			//console.log('' + JSON.stringify(this.get("newAAMItem")));
		},
		onTRSelect: function(e) { ////event selected of Button Group Transfer to Regular 
			var buttonGroup = e.sender;
			var index = buttonGroup.current().index();
			//console.log('Tr index:' + index);
			var newAAMItem = this.get('newAAMItem');
			if (index == 0) {
				newAAMItem.transferType = "TR";
			} else {
				newAAMItem.transferType = "NT";
			}

		},
		initSearch: function() {
			//console.log('initSearch');
			this.set("searchCriteria", {
				"token": localStorage.getItem("token"),
				"userId": JSON.parse(localStorage.getItem("profileData")).userId,
				"locationType": "001",
				"locationCode": "",
				"provinceId": "",
				"regionId": "",
				"siteCode": "",
				"zoneId": "",
				"version": "2"

			});

		},
		searchEquipmentList: function() {
			//console.log("searchEquipmentList");
			$('#div_article_notFound').hide();
			var newAAMItem = this.get('newAAMItem');
			var articleCriteria = this.get("articleCriteria");
			//console.log("articleCriteria :" + JSON.stringify(articleCriteria));
			app.application.showLoading();
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getArticleInfo.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
								//articleCriteria
								"articleGroupId": articleCriteria.articleGroupId,
								"articleNo": articleCriteria.articleNo,
								"articleType": articleCriteria.articleType,
								//newAAMItem
								"companyOwnerId": newAAMItem.companyOwnerId,
								"fromLocationTypeId": newAAMItem.fromLocationTypeId,
								"fromOrgLocationId": newAAMItem.fromOrgLocationId,
								"fromSiteCode": newAAMItem.fromSiteCode,
								"serviceGroupId": newAAMItem.serviceGroupId,
								"transferStatus": newAAMItem.transferType

							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								//console.log("Reponse :::: " + JSON.stringify(response));
								app.application.hideLoading();
								if (response.responseStatus != "ERROR_ALL") {
									if (response.resultInfo == "Data not found") {
										$('#div_article_notFound').html(JSON.stringify(response.resultInfo));
										$('#div_article_notFound').show();
										navigator.notification.alert(response.resultInfo,
											function() {}, "AAM : ", 'OK');
									} else {
										operation.success(response);
									}

								} else {
									$('#div_article_notFound').html(JSON.stringify(response.resultInfo));
									$('#div_article_notFound').show();
									navigator.notification.alert(response.resultInfo,
										function() {}, "AAM : ", 'OK');
								}


							},
							error: function(xhr, error) {
								//console.log('location error');

								//this.hideLoading();
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									//console.log("Get Equipment failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get Equipment failed", 'OK');
									return;
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //jobSiteAccessList
					data: "resultInfo"
				},
				model: {
					id: "articleId"
				}
			});
			//tempDS.fetch();
			this.set("tmpEqDatasource", tempDS);
			//var tmpEqDatasource = this.get("tmpEqDatasource");
			////console.log("tmpEqDatasource :" + //JSON.stringify(tmpEqDatasource));
			//tempDS.fetch(function() {
			//    //console.log('total:' + tempDS.total());

			//	if (tempDS.total() == 0) {
			//		$('#div_article_notFound').html("No Article");
			//		$('#div_article_notFound').show();
			//		//console.log("div  show");
			//	} else {
			//		$('#div_article_notFound').hide();

			//		//console.log("div  hide");
			//	}
			//})

			$("#lvSearchEquipment").kendoMobileListView({
				dataSource: tempDS,
				//autoBind : false,
				style: "inset",
				template: $("#lvSearchEquipment-template").html(),
				//pullToRefresh: true,
				click: app.aamService.viewModel.eqSelected,
				dataBound: function() {
					//var data = $("#lvSearchEquipment").data("kendoMobileListView").dataSource.data();
					////console.log(data.length);
					//var tmpEqDatasource = app.aamService.viewModel.get("tmpEqDatasource");
					$(".numeric").kendoNumericTextBox();
				}
			});

			//$("#lvSearchEquipment").data("kendoMobileListView").dataSource.read();

			$("#lvSearchEquipment").data("kendoMobileListView").refresh();
			$("#lvSearchEquipment").data("kendoMobileListView").reset();

			//this.hideLoading();


		},
		searchLocationList: function() {
			var searchcriteria = this.get("searchCriteria");
			//console.log("searchCriteria :" + JSON.stringify(searchcriteria));
			app.application.showLoading();
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=master-service&o=getLocationStore.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getLocationStore.json',
							//url: 'http://localhost/TTSMWebAPI/api/Location',
							data: JSON.stringify(searchcriteria),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response Location :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								//console.log('location error');
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {

									//console.log("Get location failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get location failed", 'OK');
									return;

								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //jobSiteAccessList
					data: "locationStoreList"
				},
				model: {
					id: "locationCode"
				}
			});
			//tempDS.fetch();

			$("#ulLocation").kendoMobileListView({
				dataSource: tempDS,
				style: "inset",
				template: $("#ulLocation-template").html(),
				//pullToRefresh: true,
				click: this.locSelected,
				dataBound: function() {
					//this.hideLoading();
					//$('#ddlregionId').data("kendoDropDownList").value('');
					//$('#ddlzoneId').data("kendoDropDownList").value('');
					//$('#ddlprovinceId').data("kendoDropDownList").value('');
					//app.aamService.viewModel.initSearch();


					kendo.bind($(".reset_searchCriteria"), searchcriteria, kendo.mobile.ui);
					app.application.hideLoading();
				}
			});

		},
		nativeScan: function() {
			cordova.plugins.barcodeScanner.scan(
				function(result) {
					var barcodeInput = result.text;
					app.aamService.viewModel.set("serailInput", barcodeInput);
					app.aamService.viewModel.addSerailNo();
				},
				function(error) {
					//alert("Scanning failed" + error);
					navigator.notification.alert("Scanning failed" + error,
						function() {}, "AAM : ", 'OK');
				}
			);
		},
		createDocument: function() {
			this.set('_canEdit', true);
			//console.log('jobAAMID :::: ' + app.aamService.viewModel.get("jobAAMId"));
			//console.log(this.mode);
			if (this.mode) {
				app.aamService.viewModel.deleteAAM_equipment_all();
				//console.log('newAAMItem : reset :mode');
				this.set("newAAMItem", {
					"token": localStorage.getItem("token"),
					"jobId": app.aamService.viewModel.get("jobAAMId"),
					"documentType": "WITHDRAW",
					"siteAccessId": "",
					"userId": JSON.parse(localStorage.getItem("profileData")).userId,
					"companyOwnerId": "",
					"fromLocationId": "",
					"fromLocationTypeId": "",
					"fromOrgLocationId": "",
					"fromSiteCode": "",
					"objectiveCode": "IM",
					"pinCreatedBy": "",
					"regionFrom": "",
					"regionTo": "",
					"remark": "",
					"serviceGroupId": "",
					"title": "",
					"toLocationTypeId": "",
					"toOrgLocationId": "",
					"toSiteCode": "",
					"transferType": "",
					"userName": "",
					"zoneFrom": "",
					"zoneTo": "",
					"docDetailList": []
				});


				//$("#ddlSiteAccess").kendoDropDownList({
				//    dataTextField: "siteCodeDesc",
				//    dataValueField: "siteId",
				//    dataSource: tempDS,
				//    value:""
				//});

				//--------------reset dropdown---------------
				$('#ddlSiteAccess').data("kendoDropDownList").value('');
				$('#ddlCompany').data("kendoDropDownList").value('');
				$('#ddlServiceGroup').data("kendoDropDownList").value('');
				$('#ddlAdmin').data("kendoDropDownList").value('');

				var dataSource = new kendo.data.DataSource({
					data: []
				});
				//var ddlprovinceId = $('#ddlprovinceId').data("kendoDropDownList").setDataSource(dataSource);
				$("#ddlprovinceId").kendoDropDownList({
					dataTextField: "provinceNameEn",
					dataValueField: "provinceId",
					autoBind: false
				});

				app.aamService.viewModel.loadSite();
				app.aamService.viewModel.loadComp();
				app.aamService.viewModel.loadSvcGroup();
				app.aamService.viewModel.loadAdminZone();

				$('.ul_detail_newAAM').show();
				$('#AAM .km-listinset').hide()
				var buttongroup = $("#ammNew-group").data("kendoMobileButtonGroup");
				buttongroup.select(0);


				this.mode = false;
			}
			var newAAMItem = this.get("newAAMItem");

			//console.log('newAAMItem.docDetailList :: ' + newAAMItem.docDetailList);
			var eqDatasource = new kendo.data.DataSource();

			eqDatasource.data(newAAMItem.docDetailList);
			eqDatasource.filter({
				field: "articleType",
				operator: "eq",
				value: "E"
			});
			//console.log('eqDatasource :::: ' + eqDatasource);
			$("#lvEquipmentNewList").kendoMobileListView({
				dataSource: eqDatasource,
				style: "inset",
				template: $("#lvEquipmentList-template").html(),
				dataBound: function() {
					$("#lvEquipmentNewList").css('display', 'block');
				}
				//,pullToRefresh: true
			});


			var maDatasource = new kendo.data.DataSource();
			maDatasource.data(newAAMItem.docDetailList);
			maDatasource.filter({
				field: "articleType",
				operator: "eq",
				value: "M"
			});
			$("#lvMatNewList").kendoMobileListView({
				dataSource: maDatasource,
				style: "inset",
				template: $("#lvMatList-template").html(),
				dataBound: function() {
					$("#lvMatNewList").css('display', 'block');
				}
				//pullToRefresh: true
			});

			//this.set("articleCriteria", {
			//    "articleGroupId": "",
			//    "articleNo": "",
			//    "articleType": ""
			//});

			//console.log("new doc : " + JSON.stringify(this.get("newAAMItem")));

		},
		SaveNewDoc: function() {
			//console.log('SaveNewDoc ::::: ' + JSON.stringify(this.get("newAAMItem")));
			var newAAMItem = this.get("newAAMItem");
			$.ajax({ //using jsfiddle's echo service to simulate remote data loading
				beforeSend: app.loginService.viewModel.checkOnline,
				type: "POST", timeout: 180000,
				//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=transaction-service&o=createDocument.json
				url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=createDocument.json',
				//url: 'http://localhost/TTSMWebAPI/api/Comp',
				data: JSON.stringify(newAAMItem),
				dataType: "json",
				contentType: 'application/json',
				success: function(response) {
					//store response

					//console.log("Response :" + JSON.stringify(response));
					if (response.responseStatus == "ERROR_ALL") {
						//alert(response.resultInfo.statusMsg);
						navigator.notification.alert(response.resultInfo.statusMsg,
							function() {}, "AAM : ", 'OK');

					}
					if (response.responseStatus == "SUCCESS") {
						//alert('SUCCESS\ndocNo : '+response.resultInfo.docNo);
						navigator.notification.alert('SUCCESS\ndocNo : ' + response.resultInfo.docNo,
							function() {}, "AAM : ", 'OK');
						//app.aamService.viewModel.mode = true;
						app.aamService.viewModel.set('mode', true);
						app.application.navigate(
							"#tabstrip-edit"
						);

					}

				},
				error: function(xhr, error) {
					app.application.hideLoading();
					if (!app.ajaxHandlerService.error(xhr, error)) {
						cache = localStorage.getItem("jbData");

						if (cache != null && cache != undefined) {
							operation.success(JSON.parse(cache));
						} else {
							//console.log("Get My Job failed");
							//console.log(xhr);
							//console.log(error);
							navigator.notification.alert(xhr.status + error,
								function() {}, "Get My Job failed", 'OK');
							return;
						}
					}
				},
				complete: function() {

				}
			});
		},
		loadSite: function() {
			//console.log('site');
			var that = app.aamService.viewModel;
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//post-json.service?s=transaction-service&o=getJobSiteAccess.json
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobSiteAccess.json',
							//url: 'http://localhost/TTSMWebAPI/api/JobSite',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"docType": "",
								"jobId": that.get("jobAAMId")
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response Site : loadSite :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								//console.log('site error');
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {

									//console.log("Get Site failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get Site failed", 'OK');
									return;

								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //jobSiteAccessList
					data: "jobSiteAccessList"
				}
			});
			//tempDS.fetch();
			$("#ddlSiteAccess").kendoDropDownList({
				dataTextField: "siteCodeDesc",
				dataValueField: "siteId",
				dataSource: tempDS
			});
			this.set("siteAccessItem", {
				"siteId": null,
				"siteCode": null,
				"locationCode": null,
				"siteCodeDesc": null,
				"regionId": null,
				"regionName": null,
				"zoneId": null,
				"zoneName": null
			});
		},
		loadCompanyOwner: function(id) {
			//console.log('get name Comp ------ ;');
			$.ajax({ //using jsfiddle's echo service to simulate remote data loading
				beforeSend: app.loginService.viewModel.checkOnline,
				type: "POST", timeout: 180000,
				//po...on.service?s=master-service&o=getMASCompany.json
				url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getMASCompany.json',
				//url: 'http://localhost/TTSMWebAPI/api/Comp',
				data: JSON.stringify({
					"token": localStorage.getItem("token"),
					"version": "2"
				}),
				dataType: "json",
				contentType: 'application/json',
				success: function(response) {
					//console.log("Response Company Ownner :" + JSON.stringify(response));
					$.each(response.masCompanys, function(i, item) {
						if (id == item.companyCode) {
							app.aamService.viewModel.set('companyOwnerName', item.companyAbbr);
						}
					});


				},
				error: function(xhr, error) {
					app.application.hideLoading();
					if (!app.ajaxHandlerService.error(xhr, error)) {

						//console.log(xhr);
						//console.log(error);
						navigator.notification.alert(xhr.status + error,
							function() {}, "Get Company Ownner failed", 'OK');
						return;

					}
				},
				complete: function() {

				}
			});




		},
		loadComp: function() {
			//console.log('Comp');
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//po...on.service?s=master-service&o=getMASCompany.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getMASCompany.json',
							//url: 'http://localhost/TTSMWebAPI/api/Comp',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response Comp :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get Comp failed", 'OK');
									return;
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //masCompanys
					data: "masCompanys"
				},
				model: {
					id: "companyCode"
				}
			});

			$("#ddlCompany").kendoDropDownList({
				dataTextField: "companyAbbr",
				dataValueField: "companyCode",
				dataSource: tempDS
			});
		},
		loadServiceGroup: function(id) {

			$.ajax({ //using jsfiddle's echo service to simulate remote data loading
				beforeSend: app.loginService.viewModel.checkOnline,
				type: "POST", timeout: 180000,
				//
				url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getMASServiceGroup.json',
				//url: 'http://localhost/TTSMWebAPI/api/svc',
				data: JSON.stringify({
					"token": localStorage.getItem("token"),
					"version": "2"
				}),
				dataType: "json",
				contentType: 'application/json',
				success: function(response) {
					//console.log("Response :" + JSON.stringify(response));
					$.each(response.masServiceGroups, function(i, item) {
						if (id == item.serviceId) {
							app.aamService.viewModel.set("serviceGroupName", item.serviceName);
						}
					});
				},
				error: function(xhr, error) {
					app.application.hideLoading();
					if (!app.ajaxHandlerService.error(xhr, error)) {
						//console.log("Get serviceGroupName failed");
						//console.log(xhr);
						//console.log(error);
						navigator.notification.alert(xhr.status + error,
							function() {}, "Get serviceGroupName failed", 'OK');
						return;

					}
				},
				complete: function() {

				}
			});



		},
		loadSvcGroup: function() {
			//console.log('Svc Group');
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getMASServiceGroup.json',
							//url: 'http://localhost/TTSMWebAPI/api/svc',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response :" + JSON.stringify(response));
							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									//console.log("Get ServiceGroup failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get Service Group failed", 'OK');
									return;

								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: {
					data: "masServiceGroups"
				},
				model: {
					id: "serviceId"
				}
			});

			$("#ddlServiceGroup").kendoDropDownList({
				dataTextField: "serviceName",
				dataValueField: "serviceId",
				dataSource: tempDS
			});
		},
		loadAdminZone: function() {
			//console.log('Admin Zone');
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getAdminZone.json',
							//url: 'http://localhost/TTSMWebAPI/api/admin',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2",
								"zoneId": "B2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response :" + JSON.stringify(response));
							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									//console.log("Get Admin Zone failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get Admin Zone failed", 'OK');
									return;
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: {
					data: "adminZones"
				}
			});
			$("#ddlAdmin").kendoDropDownList({
				dataTextField: "userName",
				dataValueField: "userName",
				dataSource: tempDS
			});
		},
		loadProvince: function() {
			//console.log('province');
			var searchCriteria = this.get("searchCriteria");
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=master-service&o=getProvince.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getProvince.json',
							//url: 'http://localhost/TTSMWebAPI/api/Comp',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2",
								"regionId": searchCriteria.regionId,
								"zoneId": searchCriteria.zoneId
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response province :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {

									//console.log("Get province failed");
									//console.log(xhr);
									//console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get province failed", 'OK');
									return;

								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //masCompanys
					data: "provinceList"
				},
				model: {
					id: "provinceId"
				}
			});

			//if ($("#ddlprovinceId").data("kendoDropDownList") != undefined && $("#ddlprovinceId").data("kendoDropDownList") != null) {
				$("#ddlprovinceId").data("kendoDropDownList").setDataSource(tempDS);
				$("#ddlprovinceId").data("kendoDropDownList").refresh();
				//} else {
				//$("#ddlprovinceId").kendoDropDownList({
				//	dataTextField: "provinceNameEn",
				//	dataValueField: "provinceId",
				//	autoBind: false
				//});
				//$("#ddlprovinceId").data("kendoDropDownList").setDataSource(tempDS);
				//$("#ddlprovinceId").data("kendoDropDownList").refresh();
				//}
		},
		loadRegion: function() {
			//console.log('region');
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=master-service&o=getRegionByUser.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getRegionByUser.json',
							//url: 'http://localhost/TTSMWebAPI/api/Comp',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2",
								"userId": "" //JSON.parse(localStorage.getItem("profileData")).userId
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response Region :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get My Job failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get My Job failed", 'OK');
										return;
									}
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //masCompanys
					data: "regions"
				},
				model: {
					id: "id"
				}
			});

			$("#ddlregionId").kendoDropDownList({
				dataTextField: "id",
				dataValueField: "id",
				dataSource: tempDS,
				index: 0
			});
		},
		showNewAAM: function() {

			var newAAMItem = this.get("newAAMItem");

			var eqDatasource = new kendo.data.DataSource();

			eqDatasource.data(newAAMItem.docDetailList);
			eqDatasource.filter({
				field: "articleType",
				operator: "eq",
				value: "E"
			});
			$("#lvEquipmentNewList").kendoMobileListView({
				dataSource: eqDatasource,
				style: "inset",
				template: $("#lvEquipmentList-template").html()
				//,pullToRefresh: true
			});


			var maDatasource = new kendo.data.DataSource();
			maDatasource.data(newAAMItem.docDetailList);
			maDatasource.filter({
				field: "articleType",
				operator: "eq",
				value: "M"
			});
			$("#lvMatNewList").kendoMobileListView({
				dataSource: maDatasource,
				style: "inset",
				template: $("#lvMatList-template").html()
				//,pullToRefresh: true
			});

			kendo.bind($(".locate"), newAAMItem, kendo.mobile.ui);
		},
		loadZone: function() {
			//console.log('region');
			var searchCriteria = this.get("searchCriteria");
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=master-service&o=getZone.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getZone.json',
							//url: 'http://localhost/TTSMWebAPI/api/Comp',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"version": "2",
								"regionId": searchCriteria.regionId
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response province :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get My Job failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get My Job failed", 'OK');
										return;
									}
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //masCompanys
					data: "zones"
				},
				model: {
					id: "id"
				}
			});


			if ($("#ddlzoneId").data("kendoDropDownList") != undefined && $("#ddlzoneId").data("kendoDropDownList") != null) {
				$("#ddlzoneId").data("kendoDropDownList").setDataSource(tempDS);
				$("#ddlzoneId").data("kendoDropDownList").refresh();
			} else {
				$("#ddlzoneId").kendoDropDownList({
					dataTextField: "description",
					dataValueField: "id",
					//dataSource: tempDS,
					autoBind: false
					//index: 0
				});
				$("#ddlzoneId").data("kendoDropDownList").setDataSource(tempDS);
				$("#ddlzoneId").data("kendoDropDownList").refresh();
			}

			
		},
		reset_requestQTY: function() {
			//$('#input_reqty').attr('aria-valuenow', '0');
		},
		checkNumberOnly: function(e) {
			//var docDetailItem = this.get("docDetailItem");
			//alert('qty :' + $(this).val() + ' total:' + docDetailItem.totalQty);
			//alert('qty :' + $(this).val());
			var key = e.which || e.keyCode;
			if (!(key >= 48 && key <= 57)) {
				e.preventDefault();
				return false;
			}
			return false;
		},
		loadJobAAMList: function(jobId) {
			app.aamService.viewModel.set('mode', true);
			var that = app.aamService.viewModel;
			that.set("jobAAMId", jobId);
			//console.log('load AAM List :::::: ' + jobId);
			//var that = this;
			var jobAAMList = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getJobAAM.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								//"jobId": 'JB14-013012',
								"jobId": jobId,
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("My AAM :" + JSON.stringify(response));
							},
							error: function(xhr, error) {
								app.application.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get My Job failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get My Job failed", 'OK');
										return;
									}
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: {
					data: "jobAAMs"
				},
				model: {
					id: "aamId"
				}
			});
			/*jobAAMList.fetch( function(){
            that.set("jobAAMDatasource",jobAAMList.at(0));
            //console.log("ffff"+JSON.stringify(jobAAMList));
            });*/
			//console.log('showType ::::: ' + app.jobService.viewModel.get('showType'));
			if (app.jobService.viewModel.get('showType') == 'view') {

				$("#lvAAMListView").kendoMobileListView({
					dataSource: jobAAMList, //.filter({ field: 'aamId', operator: 'neq', value: '' }),
					style: "inset",
					template: $("#lvAAMList-template").html(),
					//pullToRefresh: true,
					//autoBind: false,
					click: function(e) {
						//this.set("selectJobAAMItem", e.dataItem);
						//console.log("selectJobAAMItem lvAAMListView view :" + JSON.stringify(e.dataItem));
						if (JSON.stringify(e.dataItem) != "undefined") {
							app.aamService.viewModel.set("selectJobAAMItem", e.dataItem);
							app.application.navigate(
								"#AAMedit"
							);
						}
					},
					dataBound: function() {
						//that.hideLoading();
					}
				});
			} else {
				$('#lvAAMList').css('display', 'block');
				//console.log('app.jobService.viewModel.selectItem.status ::::: ' + app.jobService.viewModel.selectItem.status + ':' + app.jobService.viewModel.selectItem.statusId);
				//if (app.jobService.viewModel.selectItem.status == "Report" || app.jobService.viewModel.selectItem.status == "Close" || $('#switchAAM').data("kendoMobileSwitch").check() == false) {
				if (app.jobService.viewModel.selectItem.status == "Report" || app.jobService.viewModel.selectItem.status == "Close" || app.jobService.viewModel.selectItem.statusId == "10") {
					$("#btn_deleteAAM_doc").hide();
					$("#btn_aam_add").hide();
				} else {
					$("#btn_deleteAAM_doc").show();
					$("#btn_aam_add").show();
				}
				//console.log('lvAAMList xxxxxxxx : ' + JSON.stringify(jobAAMList));
				$("#lvAAMList").kendoMobileListView({
					dataSource: jobAAMList, //.filter({ field: 'aamId', operator: 'neq', value: '' }),
					style: "inset",
					template: $("#lvAAMList-template").html(),
					//pullToRefresh: true,
					//autoBind: false,
					click: function(e) {
						//this.set("selectJobAAMItem", e.dataItem);
						//console.log("selectJobAAMItem lvAAMList edit :" + JSON.stringify(e.dataItem));
						if (typeof e.dataItem === "undefined") {
							//alert('xxx');
						} else {
							//console.log("selectJobAAMItem lvAAMList edit2 :" + JSON.stringify(e.dataItem));
							app.aamService.viewModel.set("selectJobAAMItem", e.dataItem);
							app.application.navigate(
								"#AAMedit"
							);
						}
					},
					dataBound: function() {
						//that.hideLoading();
						$('#lvAAMList').css('display', 'block');
					}
				});
			}
			//$("#lvAAM").kendoMobileListView({
			//    dataSource: jobAAMList,//.filter({ field: 'aamId', operator: 'neq', value: '' })
			//    style: "inset",
			//    template: $("#lvAAMList-template").html(),
			//    pullToRefresh: true,
			//    //autoBind: false,
			//    dataBound: function () {
			//        //that.hideLoading();
			//    }
			//});

			that.set("jobAAMDatasource", jobAAMList);

		},


		initAAM: function() {
			var that = this;
			var aamDetail = null;
			var selectJobAAMItem = app.aamService.viewModel.get("selectJobAAMItem");

			//console.log('init AAM');
			this.set('_canEdit', false);

			//console.log('initAAMinitAAM :::::: ' + this._canEdit + JSON.stringify(selectJobAAMItem));





			aamDetail = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=viewDoc.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
								"documentNo": selectJobAAMItem.aamId
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								if (response.responseStatus == "ERROR_ALL") {
									that.set("aamDataSource", null);
									//alert('viewDoc : ' + response.resultInfo);
									navigator.notification.alert('viewDoc : ' + response.resultInfo,
										function() {}, "AAM : ", 'OK');
									app.application.navigate(
										"#tabstrip-edit"
									);

								}
								if (response.responseStatus == "SUCCESS") {
									//console.log('viewDoc :::::::: ' + JSON.stringify(response.resultInfo));
									//console.log('viewDoc :companyOwnerId::::::: ' + JSON.stringify(response.resultInfo.companyOwnerId));

									//set companyOwner name
									app.aamService.viewModel.loadCompanyOwner(response.resultInfo.companyOwnerId);
									app.aamService.viewModel.loadServiceGroup(response.resultInfo.serviceGroupId);



									var strJson = "[" + JSON.stringify(response.resultInfo) + "]"
									operation.success(JSON.parse(strJson));
									//console.log("My AAM Dtail:" + JSON.stringify(JSON.parse(strJson)));


									that.set("aamDataSource", aamDetail.at(0));


									//console.log("ffff" + JSON.stringify(aamDetail.at(0).docDetailList));
									var eqDatasource = new kendo.data.DataSource();
									eqDatasource.data(aamDetail.at(0).docDetailList);
									eqDatasource.filter({
										field: 'articleType',
										operator: 'eq',
										value: 'E'
									})
									if (JSON.stringify(eqDatasource._total) <= 0) {
										//alert(JSON.stringify(mtDatasource._total));
										$("#div_aamEdit_noEqu").show();
									} else {
										$("#div_aamEdit_noEqu").hide();
									}
									$("#lvEquipmentList").kendoMobileListView({
										dataSource: eqDatasource,
										style: "inset",
										template: $("#lvEquipmentList-template").html(),
										//pullToRefresh: true,
										//autoBind: false,
										dataBound: function() {
											//that.hideLoading();
										}
									});
									var mtDatasource = new kendo.data.DataSource();
									mtDatasource.data(aamDetail.at(0).docDetailList);
									mtDatasource.filter({
										field: 'articleType',
										operator: 'eq',
										value: 'M'
									});

									if (JSON.stringify(mtDatasource._total) <= 0) {
										//alert(JSON.stringify(mtDatasource._total));
										$("#div_aamEdit_noMat").show();
									} else {
										$("#div_aamEdit_noMat").hide();
									}
									$("#lvMatList").kendoMobileListView({
										dataSource: mtDatasource,
										style: "inset",
										template: $("#lvMatList-template").html(),
										//pullToRefresh: true,
										//autoBind: false,
										dataBound: function() {
											//that.hideLoading();
										}
									});

									operation.success(response.resultInfo);
								}

							},
							error: function(xhr, error) {
								that.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get My Job failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get My Job failed", 'OK');
										return;
									}
								}
							},
							complete: function() {

							}
						});
					}
				},

				model: {
					id: "docNo"
				}
			});

			aamDetail.read(function() {



			});


			//that.loadCompanyOwner();


			//that.loadServiceGroup();


		},
		initSearchEQ: function() {
			//console.log('initSearchEQ');

			var that = app.aamService.viewModel;
			var articleCriteria = that.get("articleCriteria");
			if (articleCriteria != null) {
				articleCriteria.articleGroupId = "";
				articleCriteria.articleNo = "";
			}
			//console.log("initSearchEQ-->articleCriteria : " + JSON.stringify(articleCriteria));
			var tempDS = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							//http://10.252.66.40:8780/TTSMWeb/rest-service/post-json.service?s=master-service&o=getArticleGroup.json
							url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getArticleGroup.json',
							//url: 'http://localhost/TTSMWebAPI/api/JobSite',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"articleType": articleCriteria.articleType,
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								//store response
								operation.success(response);
								//console.log("Response Site : initSearchEQ :" + JSON.stringify(response));

							},
							error: function(xhr, error) {
								//console.log('site error');
								that.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
									} else {
										//console.log("Get My Job failed");
										//console.log(xhr);
										//console.log(error);
										navigator.notification.alert(xhr.status + error,
											function() {}, "Get My Job failed", 'OK');
										return;
									}
								}
							},
							complete: function() {

							}
						});

					}
				},
				serverPaging: false,
				pageSize: 50,
				schema: { //jobSiteAccessList
					data: "articleGroups"
				}
			});
			//tempDS.fetch();
			$("#ddlArticleGroup").kendoDropDownList({
				dataTextField: "groupName",
				dataValueField: "groupId",
				dataSource: tempDS,
				value: ""
			});
			kendo.bind($(".aId"), articleCriteria, kendo.mobile.ui);


		},
		onArticleGroupSelect: function(e) {
			var dataItem = e.sender.dataItem(e.item.index());
			var that = app.aamService.viewModel;
			var articleCriteria = that.get("articleCriteria");
			articleCriteria.articleGroupId = dataItem.groupId;
		},

		showAAMbyId: function() {
			//console.log('int showbyid');
			//console.log('app.jobService.viewModel.selectItem.status ::::: ' + app.jobService.viewModel.selectItem.status + ':' + app.jobService.viewModel.selectItem.statusId);
			if (app.jobService.viewModel.selectItem.status == "Report" || app.jobService.viewModel.selectItem.status == "Close" || app.jobService.viewModel.selectItem.statusId == "10") {
				$("#btn_deleteAAM_doc").hide();
			} else {
				$("#btn_deleteAAM_doc").show();
			}

		}
	});

	app.aamService = {
		initAAM: function() {

			app.aamService.viewModel.initAAM();
			var listviews = this.element.find("ul.km-listview");
			$("#amm-group").kendoMobileButtonGroup({
				select: function(e) {
					listviews.hide()
						.eq(e.index)
						.show();
				},
				index: 0
			});
		},
		showAAM: function() {
			app.aamService.viewModel.showAAMbyId();
			app.aamService.viewModel.initAAM();
		},
		loadAAMList: function(jobId) {
			app.aamService.viewModel.loadJobAAMList(jobId);
		},
		newAAM: function() {

			var listviews = this.element.find("ul.km-listview");
			$("#ammNew-group").kendoMobileButtonGroup({
				select: function(e) {
					//console.log(e.index);
					listviews.hide()
						.eq(e.index)
						.show();

					if (e.index == 1) {
						app.aamService.viewModel.set("articleCriteria", {
							"articleGroupId": "",
							"articleNo": "",
							"articleType": "E"
						});
					}
					if (e.index == 2) {
						app.aamService.viewModel.set("articleCriteria", {
							"articleGroupId": "",
							"articleNo": "",
							"articleType": "M"
						});
					}


				},
				index: 0
			});

			app.aamService.viewModel.set("searchCriteria", {
				"token": localStorage.getItem("token"),
				"userId": JSON.parse(localStorage.getItem("profileData")).userId,
				"locationType": "001",
				"locationCode": "",
				"provinceId": "",
				"regionId": "",
				"siteCode": "",
				"zoneId": "",
				"version": "2"

			});
			app.aamService.viewModel.checkTab_material(false);

			app.aamService.viewModel.loadSite();
			app.aamService.viewModel.loadComp();
			app.aamService.viewModel.loadSvcGroup();
			app.aamService.viewModel.loadAdminZone();
			app.aamService.viewModel.mode = true;
		},

		showNewAAM: function() {




			var articleCriteria = app.aamService.viewModel.get("articleCriteria");
			if (articleCriteria != null) {
				articleCriteria.articleGroupId = "";
				articleCriteria.articleNo = "";
			}
			//console.log("articleCriteria :" + JSON.stringify(articleCriteria));
			app.aamService.viewModel.createDocument();
			app.aamService.viewModel.showNewAAM();
		},
		searchLocationList: function() {
			app.aamService.viewModel.searchLocationList();
		},
		initSearch: function() {

			app.aamService.viewModel.initSearch();
			//app.aamService.viewModel.loadProvince();
			app.aamService.viewModel.loadRegion();
			//app.aamService.viewModel.loadZone();
		},
		searchEquipmentList: function() {
			app.aamService.viewModel.searchEquipmentList();
		},

		detailInit: function() {
			//console.log("detailInit");
			app.aamService.viewModel.detailInit();

		},
		initSearchEQ: function() {
			//console.log("initSearchEQ");
			app.aamService.viewModel.initSearchEQ();
		},
		/*
        detailShow: function (e) {
        //console.log("uid:" + e.view.params.uid);
        var uid = e.view.params.uid;
        //console.log("uid: " + uid);
        var model = app.aamService.viewModel.get("tmpEqDatasource").getByUid(uid);

        kendo.bind(e.view.element, model, kendo.mobile.ui);

        },
        */
		viewModel: new aamViewModel()
	};
})(window);
