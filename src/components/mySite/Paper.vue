<template>
    <div class="p-grid">
    <div class="p-col-12">
    <div class="card">
        <Toolbar class="p-mb-4 field">
            <template #start>
                <Button label="New" icon="pi pi-plus" class="p-button-outlined mr-2 mb-2" @click="openPaperRegistModal" />
            </template>
        </Toolbar>

        <h3>논문 조회</h3>

        <!-- FilterService 로 바꾸자... 나중에,, -->
        <!-- <div class="p-fluid field title">
            <h3>논문 조회</h3>
            <Listbox 
            v-model="listboxValue" 
            :options="listboxValues_rebind" 
            optionLabel="showTitle" 
            :filter="true"
            @filter="getInput($event)">

                <template #option="slotProps">
                    <div class="country-item">
                        <div>{{slotProps.option.showTitle}}</div>
                    </div>
                </template>
            
            </Listbox>
        </div> -->

        <div class="card">
            <AutoComplete 
            v-model="selectedCountry1" 
            :suggestions="filteredCountries" 
            @complete="searchCountry($event)" 
            field="showTitle" class="searchPart"/>

            <Button type="button" icon="pi pi-search" :loading="loading" @click="load" class="searchPart"/>
        
        </div>




        <div>
            <!-- ref : mounted 에서  -->
            <DataTable 
                ref="paperdt" 
                :value="searchData"

                :paginator="true"
                :rows="10"
                :totalRecords="totalRecords" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} Totals:{totalRecords}"
                :rowsPerPageOptions="[10, 20, 50]"
                @page="onPage($event)" 
                
                responsiveLayout="scroll">

                
                <Column field="title" header="title"></Column>
                <Column field="author" header="author"></Column>
                <Column field="tag" header="tag"></Column>
            </DataTable>
        </div>




        <Dialog v-model:visible="paperRegistModal" :style="{ width: '60%' }" header="논문 등록" :modal="true" class="p-fluid">

            
            <!-- 논문 파일 등록 -->
            <!-- 나중에 서버 만들고 하자.. -->
            <!-- 그리고 파일 업로드를 차라리 내가 만드는것도 나쁘지 않은듯..
                 선택 만 버튼 살리고 save 시에 업로드로 -->
            <div class="p-fluid field">
                 <FileUpload 
                    name="demo[]" 
                    url="./file"
                    @select="onSelect($event)"
                    @uploader="onUpload($event)" 
                    @remove="onRemove($event)"
                    :multiple="true" 
                    accept="" 
                    :maxFileSize="1000000"
                    :showCancelButton="false">

                    <template #empty>
                        <p>Drag and drop files to here to upload.</p>
                    </template>
                </FileUpload>
            
            </div>


            <!-- 논문 정보 등록 -->
            <div class="p-fluid field">
                <label class="regModal" for="paperTitle">논문 제목 : </label>
                <InputText v-model="inputTitle" id="paperTitle" type="text"/>

                <label class="regModal" for="paperAuthor">저자 : </label>
                <InputText v-model="inputAuthor" id="paperAuthor" type="text"/>
                
                <label class="regModal" for="hashTag">참조 : </label>
                <!-- optionLabel : 선택된(chip) 애들 이름  
                   <template #option="slotProps"> 은 검색 목록 
                    v-model : 데이터 담을 변수 이름
                -->
                <MultiSelect 
                    v-model="selectedTags" 
                    :options="tagdata" 
                    placeholder="Select tags" 
                    track-by="trackBy" 
                    optionLabel="name" 
                    :filter="true" 
                    display="chip" 
                    :multiple="true" 
                    class="multiselect-custom">

                    <template #value="slotProps">
                        <div class="country-item country-item-value" v-for="option of slotProps.name" track-by="option.name" :key="option.name">
                            <div>{{option.name}}</div>
                        </div>
                    </template> 
                    <template #option="slotProps">
                        <div class="country-item">
                            <div>{{slotProps.option.name}}</div>
                        </div>
                    </template>
                </MultiSelect>
            </div>

            <!-- 저장 및 창닫기 -->
            <template #footer>
                <Button label="Save" icon="pi pi-check" @click="onSave"/>
                <Button label="Cancel" icon="pi pi-times" @click="onClose"/>
            </template>

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
            paperRegistModal : false,
            listboxValues: [
                {title: '논문 제목1', author: '저자1', tag: ['CNN','AutoEncoder','GAN']},
                {title: '논문 제목2', author: '저자2', tag: ['CNN','GAN']},
                {title: '논문 제목3', author: '저자3', tag: ['AutoEncoder','GAN']},
                {title: '논문 제목4', author: '저자4', tag: ['GAN']},
                {title: '논문 제목5', author: '저자5', tag: ['CNN','AutoEncoder']},
            ],
            listboxValue: null,
            listboxValues_rebind:[],
            dataList : [],
            listParams :{},
            searchInput : "",
            searchListVisible : false,
            selectedCountry1: null,
            filteredCountries: null,
            countries: null,
            loading:false,
            searchData : [],
            cities: [
                {name: 'New York', code: 'NY'},
                {name: 'Rome', code: 'RM'},
                {name: 'London', code: 'LDN'},
                {name: 'Istanbul', code: 'IST'},
                {name: 'Paris', code: 'PRS'}
            ],
            tagdata:[],
            selectedTags:null,
            inputAuthor:"",
            inputTitle:"",
            inputFiles:[]
            

        }
    },
    DataManager: null,
    methods:{
        openPaperRegistModal() {
            this.paperRegistModal = true;
        },
        onUpload(event) {
            console.log(event);
            //this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        },
        onSelect(event) {
            console.log(event.files[0]);
            console.log(event.files[0].name);

            event.files.forEach(file => {
                this.inputFiles.push({
                    name: file.name
                })
            });
            //this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        },
        onRemove(event) {
            console.log(event.file.name);
        },
        onSave() {
            this.listboxValues_rebind.push({
                title: this.inputTitle, 
                author: this.inputAuthor, 
                tag: this.selectedTags.map(x => x.name),
                showTitle: this.inputTitle + " - " + this.inputAuthor + " (" +
                        this.selectedTags.map(x => x.name).join(',') + ")"
            });

            this.dataList.push({
                title: this.inputTitle, 
                author: this.inputAuthor, 
                tag: this.selectedTags.map(x => x.name),
            });

            this.searchData = this.dataList;
            this.onClose();
        },
        onClose() {
            this.selectedTags = null;
            this.inputAuthor = "";
            this.inputTitle = "";
            this.inputFiles = [];
            this.paperRegistModal=false;
        },
        loadData() {
            this.dataList = this.DataManager.getPapers();
            this.tagdata = this.DataManager.getTags();
        },
        onPage(event) {
            this.listParams.page = event.page;
            this.listParams.size = event.rows;

            this.loadData();
        },
        getInput(event) {
            this.searchInput = event.value;
        },
        searchCountry(event) {
            setTimeout(() => {
                // 아무것도 안들어왔으면 전체를 드롭박스에 출력
                if (!event.query.trim().length) {
                    this.filteredCountries = [...this.listboxValues_rebind];
                }
                else {
                    // 뭐라도 들어왔으면 검색해서 출력
                    // filter 함수
                    // 아래와 같이 array에서 조건에 맞는 데이터를 array 로 반환
                    // numbers.filter(number => number > 3)

                    this.filteredCountries = this.listboxValues_rebind.filter((country) => {
                        //return country.showTitle.toLowerCase().startsWith(event.query.toLowerCase());
                        if(country.showTitle.toLowerCase().indexOf(event.query.toLowerCase()) != -1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            }, 250);
        },
        load() {
            this.loading = true;
            setTimeout(() => {
                if(typeof(this.selectedCountry1) == "object") {
                    this.searchData = [];
                    this.searchData[0] = this.selectedCountry1;
                } else {
                    this.searchData = this.filteredCountries;
                }

                this.loading = false;
                
            }, 1000);
        }
    },
    created() {
        //https://mygumi.tistory.com/201 create와 mounted 의 차이
        this.DataManager = new DataManager();
        this.searchListVisible = false;

        this.loadData();

        for (let i = 0; i<this.dataList.length; i++) {
            let temp = this.dataList[i];
            temp["showTitle"] = this.dataList[i].title + " - " + this.dataList[i].author 
                                + " (" + this.dataList[i].tag.join(",") + ")";
        

            this.listboxValues_rebind[i] = temp;
            //console.log(this.listboxValues_rebind[i]);
        }

        this.searchData = this.dataList;
    },
    mounted() {
        this.listParams = {
            page: 0,
            size: this.$refs.paperdt.rows,
        }
        
        // this.countryService.getCountries().then(data => this.countries = data);
        this.countries = this.DataManager.getCountries();

    },
    watch:{
        searchInput() {
            if (this.searchInput == "" ) {
                this.searchListVisible = false;
            } else {
                this.searchListVisible = true;
            }
        }
    },
    components:{
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