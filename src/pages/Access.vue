<template>
    <div class="exception-body access">
        <div class="exception-topbar">
            <a id="logolink" @click="goDashboard" class="layout-topbar-logo">
                <img :src="'layout/images/logo-' + (colorScheme === 'dark' ? 'freya-white' : 'freya') + '.svg'" alt="freya-layout"/>
            </a>
        </div>
        <div class="exception-wrapper">
            <div class="exception-content">
                <img src="layout/images/pages/asset-access.svg" alt="freya-layout" />
                <span>access denied</span>
            </div>
            <div class="exception-footer">
                <h4>freya</h4>
                <h6>Copyright Ⓒ PrimeTek Informatics</h6>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        colorScheme() {
            return this.$appState.colorScheme; 
        }
    },
    methods: {
        goDashboard() {
            window.location = "/#/"
        }
    }
};
</script>
