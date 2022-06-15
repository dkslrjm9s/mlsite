<template>
	<div class="login-body">
		<div class="login-wrapper">
			<div class="login-panel">
				<a @click="goDashboard" class="logo">
                    <img src="layout/images/logo-freya-single.svg" alt="freya-layout" />
                </a>
                <InputText id="email" placeholder="Email" />
                <Password id="password" placeholder="Password" :feedback="false" />
                <Button label="LOGIN" type="button"></Button>
                <a href="#">forget password?</a>
                <p>Don’t you have an account, <a href="#">sign up</a></p>
            </div>
        </div>
        <div class="login-footer">
			<h4>freya</h4>
            <h6>Copyright Ⓒ PrimeTek Informatics</h6>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goDashboard() {
            window.location = "/#/"
        }
    }
};
</script>
