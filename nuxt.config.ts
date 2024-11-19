// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true, // Ensure SSR is enabled
    modules: [
      '@nuxtjs/tailwindcss',
      '@primevue/nuxt-module',
      '@nuxt/icon',
      '@ant-design-vue/nuxt',
      'vuetify-nuxt-module',
      'vue3-carousel-nuxt'
    ],
    plugins: [
        '~/plugins/vue3-toastify.ts',
         ],
    
    app: {
        head: {
            title: 'Up Sale',
            link: [
              { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "anonymous" },
      { href: 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap', rel: 'stylesheet' },
                {
                    rel: "stylesheet",
                    href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0-alpha1/css/bootstrap.min.css",
                    integrity:
                        "sha512-72OVeAaPeV8n3BdZj7hOkaPSEk/uwpDkaGyP4W2jSzAC8tfiO4LMEDWoL3uFp5mcZu+8Eehb4GhZWFwvrss69Q==",
                    crossorigin: "anonymous",
                    referrerpolicy: "no-referrer",
                },
                {
                    rel: "stylesheet",
                    href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
                },
            ],
            script: [
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0-alpha1/js/bootstrap.bundle.min.js",
                    integrity:
                        "ssha512-Sct/LCTfkoqr7upmX9VZKEzXuRk5YulFoDTunGapYJdlCwA+Rl4RhgcPCLf7awTNLmIVrszTPNUFu4MSesep5Q==",
                    crossorigin: "anonymous",
                    referrerpolicy: "no-referrer",
                },
            ],
        },
    },
    css: [
        '@/assets/css/global.css'
    ],
    runtimeConfig: {
        public: {
            URL: process.env.BASE_URL,
        }
    }
})