<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isDev = import.meta.env.DEV

const navOpen = ref(false)

const calendlyUrl = 'https://calendly.com/alyosperformance'
const calendlyEmbedUrl = `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=05060a&text_color=ffffff&primary_color=10b981`
const formspreeEndpoint = ''

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const submitState = ref('idle')

const canSubmit = computed(() => {
  return (
    submitState.value !== 'sending' &&
    form.value.name.trim().length > 1 &&
    form.value.email.trim().length > 3 &&
    form.value.message.trim().length > 5
  )
})

async function submitContact() {
  if (!canSubmit.value) return

  submitState.value = 'sending'
  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    message: form.value.message,
    source: 'website',
  }

  try {
    if (formspreeEndpoint) {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Form submission failed')
    } else {
      const subject = encodeURIComponent('Demande de rendez-vous / contact')
      const body = encodeURIComponent(
        `Nom: ${payload.name}\nEmail: ${payload.email}\nTéléphone: ${payload.phone}\n\nMessage:\n${payload.message}`,
      )
      window.location.href = `mailto:contact@exemple.com?subject=${subject}&body=${body}`
    }

    submitState.value = 'success'
    form.value = { name: '', email: '', phone: '', message: '' }
  } catch {
    submitState.value = 'error'
  }
}

const photos = [
  'photos/1b0b728a-ed2a-479e-833c-3faea2a65246.jpeg',
  'photos/6af518ab-0b44-40f6-b53a-2ed2fad52c92.jpeg',
  'photos/79651b91-5f66-41d9-a1e9-629de2e23d10.jpeg',
  'photos/7bebeb7f-f42b-45f2-8a0f-501a12827343.jpeg',
  'photos/7c87b008-bef0-4b1f-ad91-f5d5649445e6.jpeg',
  'photos/7d068cfe-c8ba-4ab0-b8ca-9f99d0f428d9.jpeg',
  'photos/b0eaef72-ed1f-4388-b44f-0f57b2e45d5b.jpeg',
  'photos/c7aac452-4ade-4f40-ba3a-b6ea80fa8aa9.jpeg',
  'photos/ee87fa54-0ca3-4eb0-8aaa-d5fab4f6ff24.jpeg',
  'photos/f2310427-a312-49ea-9523-d56625c5d7b9.jpeg',
]

const logoSrc = photos[photos.length - 1]
const galleryPhotos = photos.slice(0, -1)

const backgroundPhotos = computed(() => {
  return [
    photos[4],
    photos[1],
    photos[3],
    photos[6],
    photos[4],
  ]
})

const bgEls = ref([])
const activeBgIndex = ref(0)

function setBgEl(index, el) {
  if (!el) return
  bgEls.value[index] = el
}

function setActiveBackground(index) {
  activeBgIndex.value = index
  const els = bgEls.value
  if (!els?.length) return

  els.forEach((el, i) => {
    gsap.set(el, { willChange: 'opacity' })
    gsap.to(el, {
      opacity: i === index ? 1 : 0,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: true,
    })
  })
}

let ctx

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    if (isDev) console.log('[bg] layers:', bgEls.value.length)
    setActiveBackground(0)

    const sections = gsap.utils.toArray('[data-bg]')
    sections.forEach((section) => {
      const idx = Number(section.getAttribute('data-bg') || '0')
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setActiveBackground(idx),
        onEnterBack: () => setActiveBackground(idx),
      })
    })

    ScrollTrigger.refresh()

    gsap.from('[data-hero]', {
      opacity: 0,
      y: 16,
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.08,
    })

    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
        },
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="relative min-h-screen text-white">
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        v-for="(src, i) in backgroundPhotos"
        :key="src + i"
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
        :ref="(el) => setBgEl(i, el)"
        :style="{ backgroundImage: `url(${src})`, filter: 'saturate(1.08) contrast(1.02) brightness(0.98)' }"
      />
      <div class="absolute inset-0 bg-ink-950/0" />
      <div class="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,6,10,0.10),rgba(5,6,10,0.02),rgba(5,6,10,0.16))]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]" />
    </div>

    <div
      v-if="isDev"
      class="fixed bottom-4 right-4 z-[60] rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur"
    >
      bg: {{ activeBgIndex }}
    </div>

    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/25 backdrop-blur-2xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" class="flex items-center gap-3 font-semibold tracking-tight">
          <img
            :src="logoSrc"
            alt="Logo"
            class="h-9 w-9 rounded-lg object-contain"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav class="hidden items-center gap-7 text-sm text-white/80 md:flex">
          <a class="hover:text-white" href="#apropos">À propos</a>
          <a class="hover:text-white" href="#prestations">Prestations</a>
          <a class="hover:text-white" href="#galerie">Galerie</a>
          <a class="hover:text-white" href="#contact">Contact</a>
          <a
            class="rounded-full bg-accent-500 px-4 py-2 font-medium text-ink-950 shadow-sm shadow-accent-500/30 hover:bg-accent-400"
            href="#contact"
          >
            Réserver
          </a>
        </nav>

        <button
          class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 md:hidden"
          type="button"
          @click="navOpen = !navOpen"
        >
          Menu
        </button>
      </div>

      <div v-if="navOpen" class="border-t border-white/10 bg-ink-950 md:hidden">
        <div class="mx-auto grid max-w-6xl gap-2 px-5 py-4 text-sm text-white/80">
          <a class="py-2 hover:text-white" href="#apropos" @click="navOpen = false">À propos</a>
          <a class="py-2 hover:text-white" href="#prestations" @click="navOpen = false">Prestations</a>
          <a class="py-2 hover:text-white" href="#galerie" @click="navOpen = false">Galerie</a>
          <a class="py-2 hover:text-white" href="#contact" @click="navOpen = false">Contact</a>
          <a
            class="mt-2 inline-flex w-fit rounded-full bg-accent-500 px-4 py-2 font-medium text-ink-950"
            href="#contact"
            @click="navOpen = false"
          >
            Réserver
          </a>
        </div>
      </div>
    </header>

    <main id="top" class="relative z-10 pt-20">
      <section class="relative" data-bg="0">
        <div class="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-5 py-16 md:py-24">
          <div class="max-w-2xl">
            <p data-hero class="text-sm font-medium tracking-wide text-white/70">Massage & récupération</p>
            <h1
              data-hero
              class="mt-4 text-4xl font-semibold leading-tight tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:text-5xl"
            >
              Soulage tes tensions.
              <span class="text-white/70">Retrouve ton énergie.</span>
            </h1>
            <p data-hero class="mt-6 text-base leading-relaxed text-white/75">
              Une approche professionnelle, orientée bien-être et performance, avec des séances adaptées à ton corps,
              ton rythme et tes objectifs.
            </p>
            <div data-hero class="mt-8 flex flex-wrap items-center gap-3">
              <a
                class="rounded-full bg-accent-500 px-5 py-3 text-sm font-medium text-ink-950 shadow-sm shadow-accent-500/30 hover:bg-accent-400"
                href="#contact"
              >
                Prendre rendez-vous
              </a>
              <a
                class="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                href="#prestations"
              >
                Voir les prestations
              </a>
            </div>

            <div data-hero class="mt-10 grid grid-cols-2 gap-4 text-sm text-white/75">
              <div class="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-2xl shadow-lg shadow-black/20">
                <p class="font-medium text-white">Séances ciblées</p>
                <p class="mt-1 text-white/70">Sport, détente, mobilité</p>
              </div>
              <div class="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-2xl shadow-lg shadow-black/20">
                <p class="font-medium text-white">Suivi simple</p>
                <p class="mt-1 text-white/70">WhatsApp / Calendly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apropos" class="mx-auto max-w-6xl px-5 py-16 md:py-24" data-bg="1">
        <div data-reveal class="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p class="text-sm font-medium tracking-wide text-white/70">À propos</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Une approche complète</h2>
            <p class="mt-5 leading-relaxed text-white/75">
              Chaque séance est construite pour répondre à un besoin concret : relâcher une zone tendue, améliorer la
              récupération, ou simplement te remettre bien dans ton corps.
            </p>
          </div>
          <div class="grid gap-4">
            <div class="rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur-xl">
              <p class="font-medium text-white">Mission</p>
              <p class="mt-2 text-white/70">Améliorer ton confort au quotidien et t’aider à bouger sans gêne.</p>
            </div>
            <div class="rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur-xl">
              <p class="font-medium text-white">Objectifs</p>
              <p class="mt-2 text-white/70">Prévenir les douleurs, optimiser la mobilité et soutenir la performance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prestations" class="border-y border-white/10" data-bg="2">
        <div class="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div data-reveal class="max-w-2xl">
            <p class="text-sm font-medium tracking-wide text-white/70">Prestations</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Des services clairs et efficaces</h2>
            <p class="mt-5 leading-relaxed text-white/75">
              Des formats simples, avec une intention précise pour chaque séance.
            </p>
          </div>

          <div class="mt-10 grid gap-5 md:grid-cols-2">
            <article data-reveal class="rounded-2xl border border-white/12 bg-white/12 p-6 backdrop-blur-2xl shadow-lg shadow-black/20">
              <h3 class="text-lg font-semibold">Massage Sportif</h3>
              <p class="mt-2 text-white/70">Récupération musculaire, tensions, préparation / retour d’effort.</p>
              <p class="mt-4 text-sm font-medium text-white/80">Disponible</p>
            </article>
            <article data-reveal class="rounded-2xl border border-white/12 bg-white/12 p-6 backdrop-blur-2xl shadow-lg shadow-black/20">
              <h3 class="text-lg font-semibold">Cupping Therapy</h3>
              <p class="mt-2 text-white/70">Ventouses pour relâcher les adhérences et améliorer la souplesse.</p>
              <p class="mt-4 text-sm font-medium text-white/80">Sur demande</p>
            </article>
            <article data-reveal class="rounded-2xl border border-white/12 bg-white/12 p-6 backdrop-blur-2xl shadow-lg shadow-black/20">
              <h3 class="text-lg font-semibold">Préparation Physique</h3>
              <p class="mt-2 text-white/70">Programme sur mesure selon tes objectifs et ton niveau.</p>
              <p class="mt-4 text-sm font-medium text-white/80">Bientôt</p>
            </article>
            <article data-reveal class="rounded-2xl border border-white/12 bg-white/12 p-6 backdrop-blur-2xl shadow-lg shadow-black/20">
              <h3 class="text-lg font-semibold">Ostéo Massage</h3>
              <p class="mt-2 text-white/70">Travail ciblé pour la mobilité et les zones sensibles.</p>
              <p class="mt-4 text-sm font-medium text-white/80">Disponible</p>
            </article>
          </div>
        </div>
      </section>

      <section id="galerie" class="mx-auto max-w-6xl px-5 py-16 md:py-24" data-bg="3">
        <div data-reveal class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p class="text-sm font-medium tracking-wide text-white/70">Visuels</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Ambiance & séances</h2>
          </div>
          <p class="text-sm text-white/70">Photos utilisées : dossier Francis</p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="src in galleryPhotos"
            :key="src"
            data-reveal
            class="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/12 backdrop-blur-2xl shadow-lg shadow-black/20"
          >
            <img
              class="h-56 w-full object-cover object-[50%_20%] transition duration-500 group-hover:scale-[1.03]"
              :src="src"
              alt=""
            />
          </div>
        </div>
      </section>

      <section id="contact" class="border-t border-white/10" data-bg="4">
        <div class="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div data-reveal>
            <p class="text-sm font-medium tracking-wide text-white/70">Contact</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Prendre rendez-vous</h2>
            <p class="mt-5 leading-relaxed text-white/75">
              Dis-moi ce dont tu as besoin (zone, douleur, objectif). Je te propose un créneau et un format adapté.
            </p>
            <div class="mt-8 rounded-2xl border border-white/12 bg-white/12 p-4 backdrop-blur-2xl shadow-lg shadow-black/20">
              <p class="text-sm font-medium text-white">Calendrier</p>
              <p class="mt-1 text-sm text-white/70">Choisis un créneau directement dans le calendrier.</p>
              <div class="mt-4 overflow-hidden rounded-xl border border-white/10 bg-ink-950">
                <iframe
                  class="block h-[720px] w-full"
                  :src="calendlyEmbedUrl"
                  title="Calendrier de réservation"
                  frameborder="0"
                />
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <a
                  class="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                  :href="calendlyUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir en plein écran
                </a>
              </div>
            </div>
          </div>

          <div data-reveal class="rounded-2xl border border-white/12 bg-white/12 p-6 backdrop-blur-2xl shadow-lg shadow-black/20">
            <p class="text-sm font-medium text-white">Formulaire de contact</p>
            <p class="mt-1 text-sm text-white/70">
              Tu peux envoyer un message, même si tu ne trouves pas de créneau parfait.
            </p>

            <form class="mt-5 grid gap-4" @submit.prevent="submitContact">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-white/80" for="name">Nom</label>
                <input
                  id="name"
                  v-model="form.name"
                  class="h-11 rounded-xl border border-white/10 bg-ink-950/60 px-4 text-sm text-white outline-none ring-accent-500/40 placeholder:text-white/40 focus:ring-2"
                  type="text"
                  autocomplete="name"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-white/80" for="email">Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    class="h-11 rounded-xl border border-white/10 bg-ink-950/60 px-4 text-sm text-white outline-none ring-accent-500/40 placeholder:text-white/40 focus:ring-2"
                    type="email"
                    autocomplete="email"
                    placeholder="vous@email.com"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-white/80" for="phone">Téléphone (optionnel)</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    class="h-11 rounded-xl border border-white/10 bg-ink-950/60 px-4 text-sm text-white outline-none ring-accent-500/40 placeholder:text-white/40 focus:ring-2"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+32 ..."
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium text-white/80" for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="min-h-[120px] resize-y rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white outline-none ring-accent-500/40 placeholder:text-white/40 focus:ring-2"
                  placeholder="Expliquez votre besoin (douleurs, zone, objectif, disponibilité…)"
                  required
                />
              </div>

              <button
                class="inline-flex h-11 items-center justify-center rounded-xl bg-accent-500 px-5 text-sm font-medium text-ink-950 shadow-sm shadow-accent-500/30 hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                :disabled="!canSubmit"
              >
                <span v-if="submitState === 'sending'">Envoi…</span>
                <span v-else>Envoyer</span>
              </button>

              <p v-if="submitState === 'success'" class="text-sm text-white/70">Message envoyé.</p>
              <p v-else-if="submitState === 'error'" class="text-sm text-white/70">
                Impossible d’envoyer le message. Réessaie ou contacte directement par email.
              </p>
            </form>

            <div class="mt-8 grid gap-4 text-sm text-white/80">
              <div>
                <p class="font-medium text-white">Adresse</p>
                <p class="mt-1 text-white/70">Ixelles, Bruxelles</p>
              </div>
              <div>
                <p class="font-medium text-white">Email</p>
                <p class="mt-1 text-white/70">contact@exemple.com</p>
              </div>
              <div>
                <p class="font-medium text-white">Réseaux</p>
                <p class="mt-1 text-white/70">Instagram / LinkedIn / Facebook</p>
              </div>
              <div class="pt-2">
                <a
                  class="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 font-medium text-white/90 hover:bg-white/10"
                  href="#top"
                >
                  Retour en haut
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer class="border-t border-white/10">
          <div class="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <p>© {{ new Date().getFullYear() }} Francis Massage. Tous droits réservés.</p>
            <p>Mentions légales</p>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>
