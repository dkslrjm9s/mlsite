<template>
    <div class="p-grid">
    <div class="p-col-12">
    <div class="card">
        <h1> > 통계 정보 </h1>
    </div>

    <div class="card">

        <div class="p-fluid grid formgrid">

            <div class="field col-12 md:col-6">
                <label >From</label>
                <Calendar v-model="fromDate" :showIcon="true" dateFormat="yy-mm-dd"/>
            </div>

            <div class="field col-12 md:col-6">
                <label >To</label>
                <Calendar v-model="toDate" :showIcon="true" dateFormat="yy-mm-dd"/>
            </div>

            <div class="field col-12 md:col-2">
                <Button label="조회" @click="onSearch()"/>
            </div>
            
        </div>
        
    </div>

    <div class="card">
        <DataTable
                ref="dt"

                :value="dataList"
                :lazy="false" 
                :loading="loading" 

                rowGroupMode="rowspan"
                groupRowsBy="type"
                sortMode="single"

                :paginator="true"
                :rows="10"
                :totalRecords="totalRecords" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} Totals:{totalRecords}"
                :rowsPerPageOptions="[10, 20, 50]"
                @page="onPage($event)" 

                :reorderableColumns="true"
                :dataKey="hash"
                :showGridlines="false"
                :rowHover="true"
                :resizableColumns="true" columnResizeMode="expand"
                responsiveLayout="scroll"
                @columnReorder="onColReorder"

                @rowExpand="onRowExpand"
                v-model:expandedRows="expandedRows"
            >

            <Column field="type" header="구분" headerStyle="width: 10%"/>
            <Column field="errCode" header="Datahub결과코드" headerStyle="width: 10%"/>
            <Column field="result" header="스크래핑결과" headerStyle="width: 10%"/>
            <Column field="ecode" header="스크래핑결과코드" headerStyle="width: 10%"/>
            <Column field="errmsg" header="스크래핑메세지" headerStyle="width: 40%"/>
            <Column field="cnt" header="건수" headerStyle="width: 10%"/>
            <Column field="type" header="상세내역" headerStyle="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-bars" class="p-button-rounded p-button-outlined" @click="onSearchDetail(slotProps.data)"/>
                </template>
            </Column>


        </DataTable>


        <Dialog v-model:visible="detailDialog" :style="{ width: '70%' }" v-bind:header="detailHeader" :modal="true" class="p-fluid">
            <DataTable
                ref="dts"
                :value="detailDataList"
                :lazy="false" 
                :loading="loading" 

                :paginator="true"
                :rows="10"
                :totalRecords="detailTotalRecords" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} Totals:{totalRecords}"
                :rowsPerPageOptions="[10, 20, 50]"
                @page="onDetailPage($event)"
                

                :reorderableColumns="true"
                :dataKey="hash"
                :showGridlines="false"
                :rowHover="true"
                :resizableColumns="true" columnResizeMode="expand"
                responsiveLayout="scroll"
                @columnReorder="onColReorder"

                @rowExpand="onRowExpand"
                v-model:expandedRows="expandedDetailRows"
            >

                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="DownLoad CSV File" @click="exportCSV($event)" />
                    </div>
                </template>

                <Column field="type" header="TYPE" />
                <Column field="fcode" header="FCODE" />
                <Column field="data" header="DATA" />
                <Column field="reqTime" header="요청시간" />
                <Column field="errCode" header="데이터허브 에러코드" />
                <Column field="result" header="스크래핑 성공여부" />
                <Column field="ecode" header="스크래핑 에러코드"/>
                <Column field="errmsg" header="스크래핑 에러메세지"/>
                <Column field="cnt" header="조회건수"/>
            </DataTable>
        </Dialog>

    </div>
    </div>
    </div>

    
</template>

<script>

import DataManager from './service/DataManager';

export default {
    data() {
        return {
            listParams:{},
            fromDate : "",
            toDate : "",
            dataList:[],
            loading:false,
            totalRecords:0,
            expandedRows:[],
            detailDialog:false,
            detailHeader:"",
            detailTotalRecords:0,
            detailDataList:[],
            expandedDetailRows:[],
            listDetailParams:{},
            detailloading:false
            
        }
    },
    DataManager: null,
    methods:{
        onSearch() {
            this.loadData();
        },
        onPage(event) {
            console.log(event);
            this.listParams.page = event.page;
            this.listParams.size = event.rows;

            // this.loadData();
        },
        onDetailPage(event) {
            console.log(event);
            this.listDetailParams.page = event.page;
            this.listDetailParams.size = event.rows;

            // this.onDetailLoadData();
        },
        loadData() {
            this.dataList = [];
            this.loading = true;


            let tempList = this.DataManager.getSearchs();
            let tempList2 = [];

            for (let temp in tempList) {
                if(typeof(tempList[temp]) == "object") {
                    tempList[temp].forEach(data => {

                        tempList2.push({
                            type: (temp=="cardList") ? "카드" : "계좌",
                            hash:data.hash,
                            fcode:data.fcode,
                            data:data.data,
                            result:data.result,
                            errCode:data.errCode,
                            ecode:data.ecode,
                            errmsg:data.errmsg,
                            etrack:data.etrack,
                        });

                    });
                }
            }

            tempList2.map(item => {
                if(this.dataList.find(object => {
                    if( object.result === item.result && 
                        object.errCode === item.errCode &&
                        object.ecode === item.ecode &&
                        object.errmsg === item.errmsg) {
                            object.cnt++;
                            return true;
                        }
                })) {
                    console.log("");
                } else {
                    item.cnt = 1;
                    this.dataList.push(item);
                }
            });

            // console.log(this.dataList);
            this.totalRecords = this.dataList.length;
            this.loading = false;
        },
        onSearchDetail(event) {
            this.detailloading = true;
            this.detailHeader = "상세내역 " + this.fromDate.toISOString().substring(0,10) + " ~ " + this.toDate.toISOString().substring(0,10);
            this.detailDialog = true;

            // this.listDetailParams = {
            //     page: 0,
            //     size: this.$refs.dts.rows,
            // }
        
            this.onDetailLoadData(event.type);

            this.detailloading = false;

        },
        onDetailLoadData(type) {
            this.detailDataList = [];
            let tempData = [];

            if (type=="카드") {
                tempData = this.DataManager.getDetailCards();
            } else if (type=="계좌") {
                tempData = this.DataManager.getDetailBanks();
            }

            tempData.content.forEach(data => {

                let time = new Date(data.reqTime[0], Number(data.reqTime[1]) - 1, data.reqTime[2], data.reqTime[3], data.reqTime[4], data.reqTime[5]).toISOString().substring(0,19).replace("T"," ");
                this.detailDataList.push({
                    type:data.type,
                    fcode:data.fcode,
                    data:data.encData,
                    reqTime:time,
                    errCode:data.errCode,
                    result:data.result,
                    ecode:data.ecode,
                    errmsg:data.errmsg,
                    cnt:0
                });
            });
            
            console.log(this.detailDataList);

            this.detailTotalRecords = this.detailDataList.length;
        },
        exportCSV() {
            this.$refs.dts.exportCSV();
        }
    },
    created() {
        this.fromDate = new Date();
        this.toDate = new Date();
        this.DataManager = new DataManager();
    },
    mounted() {
        this.listParams = {
            page: 0,
            size: this.$refs.dt.rows,
        }

        // this.listDetailParams = {
        //     page: 0,
        //     size: 10,
        // }

        // this.loadData();
    }
}
</script>

<style scoped lang="scss">
	::v-deep(.p-multiselect) {
		min-width: 15rem;
	}
	::v-deep(.multiselect-custom-virtual-scroll .p-multiselect) {
		min-width: 20rem;
	}
	::v-deep(.multiselect-custom .p-multiselect-label) {
		padding-top: .25rem;
		padding-bottom: .25rem;
	}
	::v-deep(.multiselect-custom .country-item.country-item-value) {
		padding: .25rem .5rem;
		border-radius: 3px;
		display: inline-flex;
		margin-right: .5rem;
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}
	::v-deep(.multiselect-custom .country-item.country-item-value img.flag) {
		width: 17px;
	}
	.country-item {
		display: flex;
		align-items: center;
	}
	.country-item img.flag {
		width: 18px;
		margin-right: .5rem;
	}
	::v-deep(.multiselect-custom .country-placeholder) {
		padding: 0.25rem;
	}
	::v-deep(.p-chips .p-chips-token) {
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}
	::v-deep(.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token) {
		margin: 0.1rem 0.5rem 0.1rem 0;
	}
    .regModal{
        margin: 0px auto;
        padding: 10px 0px;
    }
    .title{
        margin-top: 30px auto;
        padding-bottom: 20px;
    }
    .searchSpan {
        display: inline;
    }
    .searchPart {
        display: inline-block;
    }
</style>