<template>
    <div class="menu-wrapper" :class="{ 'layout-sidebar-active' : sidebarActive}"
        @click="onMenuClick" @mouseover="onSidebarMouseOver" @mouseleave="onSidebarMouseLeave">
        <div class="sidebar-logo">
            <router-link to="/">
                <img src="layout/images/logo-freya-single.svg" alt="freya-layout">
            </router-link>
            <a class="sidebar-pin" @click="onToggleMenu($event)">
                <span class="pin"></span>
            </a>
        </div>

        <div class="layout-menu-container">
            <AppSubmenu class="layout-menu" :items="menu" :layoutMode="layoutMode" :parentMenuItemActive="true" :menuActive="menuActive" :mobileMenuActive="mobileMenuActive" :root="true" @menuitem-click="onMenuItemClick" @root-menuitem-click="onRootMenuItemClick" />
        </div>
    </div>
</template>

<script>
import AppSubmenu from "./AppSubmenu";
export default {
    name: "AppMenu",
    emits: ["menu-click", "menuitem-click", "root-menuitem-click", "toggle-menu", "sidebar-mouse-over", "sidebar-mouse-leave"],
    props: {
        sidebarActive: Boolean,
        sidebarStatic: Boolean,
        layoutMode: String,
        menuActive: Boolean,
        mobileMenuActive: Boolean
    },
    data() {
        return {
            menu: [
                {label: "Dashboard", icon: "pi pi-home", to: "/"},
                {label: "Paper", icon: "pi pi-star", to: "/Paper"},
                {label: "Statistics", icon: "pi pi-star", to: "/Statistics"},
                {
                    label: "UI Kit", icon: "pi pi-star",
                    items: [
                        {label: "Form Layout", icon: "pi pi-id-card", to: "/formlayout"},
                        {label: "Input", icon: "pi pi-check-square", to: "/input"},
                        {label: "Float Label", icon: "pi pi-bookmark", to: "/floatlabel"},
                        {label: "Invalid State", icon: "pi pi-exclamation-circle", to: "/invalidstate"},
                        {label: "Button", icon: "pi pi-mobile", to: "/button", class: 'rotated-icon'},
                        {label: "Table", icon: "pi pi-table", to: "/table"},
                        {label: "List", icon: "pi pi-list", to: "/list"},
                        {label: "Tree", icon: "pi pi-share-alt", to: "/tree"},
                        {label: "Panel", icon: "pi pi-tablet", to: "/panel"},
                        {label: "Overlay", icon: "pi pi-clone", to: "/overlay"},
                        {label: "Media", icon: "pi pi-image", to: "/media"},
                        {label: "Menu", icon: "pi pi-bars", to: "/menu"},
                        {label: "Message", icon: "pi pi-comment", to: "/messages"},
                        {label: "File", icon: "pi pi-file", to: "/file"},
                        {label: "Chart", icon: "pi pi-chart-bar", to: "/chart"},
                        {label: "Misc", icon: "pi pi-circle-off", to: "/misc"},
                    ],
                },
                {
                    label: "Utilities", icon: "pi pi-compass",
                    items: [
                        {label: "Display", icon:"pi pi-desktop", to:"/display"},
                        {label: "Elevation", icon:"pi pi-external-link", to:"/elevation"},
                        {label: "Flexbox", icon:"pi pi-directions", to:"/flexbox"},
                        {label: "Icons", icon:"pi pi-prime", to:"/icons"},
                        {label: "Text", icon:"pi pi-pencil", to:"/text"},
                        {label: "Widgets", icon:"pi pi-star", to:"/widgets"},
                        {label: "Grid System", icon:"pi pi-th-large", to:"/grid"},
                        {label: "Spacing", icon:"pi pi-arrow-right", to:"/spacing"},
                        {label: "Typography", icon:"pi pi-align-center", to:"/typography"},
                    ],
                },
                {
                    label: "UI Blocks", icon: "pi pi-building",
                    items: [
                        {label: "Free Blocks", icon: "pi pi-fw pi-eye", to: "/blocks", badge: "NEW"},
                        {label: "All Blocks", icon: "pi pi-fw pi-globe", url: "https://www.primefaces.org/primeblocks-vue", target: "_blank"}
                    ]
                },
                {
                    label: "Pages", icon: "pi pi-briefcase",
                    items: [
                        {label: "Crud", icon: "pi pi-pencil", to: "/crud"},
                        {label: "Calendar", icon: "pi pi-calendar-plus", to: "/calendar"},
                        {label: 'Timeline', icon: 'pi pi-calendar', to: '/timeline'},
                        {label: "Landing", icon: "pi pi-globe", url: "pages/landing.html", target: "_blank"},
                        {label: "Login", icon: "pi pi-sign-in", to: "/login"},
                        {label: "Invoice", icon: "pi pi-dollar", to: "/invoice"},
                        {label: "Help", icon: "pi pi-question-circle", to: "/help"},
                        {label: "Error", icon: "pi pi-times-circle", to: "/error"},
                        {label: "Not Found", icon: "pi pi-exclamation-circle", to: "/notfound"},
                        {label: "Access Denied", icon: "pi pi-lock", to: "/access"},
                        {label: "Empty", icon: "pi pi-circle-off", to: "/empty"}
                    ],
                },
                {
                    label: "Hierarchy", icon: "pi pi-align-left",
                    items: [
                        {
                            label: "Submenu 1",icon: "pi pi-align-left",
                            items: [
                                {
                                    label: "Submenu 1.1", icon: "pi pi-align-left",
                                    items: [
                                        {label: "Submenu 1.1.1", icon: "pi pi-align-left"},
                                        {label: "Submenu 1.1.2", icon: "pi pi-align-left"},
                                        {label: "Submenu 1.1.3", icon: "pi pi-align-left"},
                                    ],
                                },
                                {
                                    label: "Submenu 1.2", icon: "pi pi-align-left",
                                    items: [
                                        {label: "Submenu 1.2.1", icon: "pi pi-align-left"},
                                    ],
                                },
                            ],
                        },
                        {
                            label: "Submenu 2", icon: "pi pi-align-left",
                            items: [
                                {
                                    label: "Submenu 2.1", icon: "pi pi-align-left",
                                    items: [
                                        {label: "Submenu 2.1.1", icon: "pi pi-align-left"},
                                        {label: "Submenu 2.1.2", icon: "pi pi-align-left"},
                                    ],
                                },
                                {
                                    label: "Submenu 2.2", icon: "pi pi-align-left",
                                    items: [
                                        {label: "Submenu 2.2.1", icon: "pi pi-align-left"},
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Start", icon: "pi pi-download",
                    items: [
                        {label: "Buy Now", icon: "pi pi-shopping-cart", command: () => window.open("https://www.primefaces.org/store", "_blank")},
                        {label: "Documentation", icon: "pi pi-info-circle", to: "/documentation"},
                    ],
                },
            ]
        }
    },
    methods: {
        onSidebarMouseOver() {
            if (this.layoutMode === "sidebar" && !this.sidebarStatic) {
                this.$emit("sidebar-mouse-over");
            }
        },
        onSidebarMouseLeave() {
            if (this.layoutMode === "sidebar" && !this.sidebarStatic) {
                setTimeout(() => {
                    this.$emit("sidebar-mouse-leave");
                }, 250);
            }
        },
        onToggleMenu(event) {
            this.$emit("toggle-menu", event);
        },
        onMenuClick(event) {
            this.$emit("menu-click", event);
        },
        onMenuItemClick(event) {
            this.$emit("menuitem-click", event);
        },
		onRootMenuItemClick(event) {
			this.$emit("root-menuitem-click", event);
		}
    },
    components: { AppSubmenu },
};
</script>