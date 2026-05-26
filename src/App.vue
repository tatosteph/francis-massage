<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navOpen = ref(false)

const calendlyUrl = 'https://calendly.com/alyosperformance'
const calendlyEmbedUrl = `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=f5f0e8`
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

let ctx

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
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
  <div class="relative min-h-screen bg-[#050505] text-[#f5f0e8]">
    <div class="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(245,240,232,0.08),transparent_30%),linear-gradient(180deg,#050505_0%,#101010_46%,#050505_100%)]" />

    <header class="fixed inset-x-0 top-0 z-50 border-b border-[#f5f0e8]/10 bg-[#050505]">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <a href="#top" class="flex items-center gap-3 font-semibold tracking-tight">
          <img
            :src="logoSrc"
            alt="Logo"
            class="h-10 w-10 rounded-full border border-[#f5f0e8]/20 object-contain"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav class="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.22em] text-[#f5f0e8]/70 md:flex">
          <a class="hover:text-[#f5f0e8]" href="#apropos">Concept</a>
          <a class="hover:text-[#f5f0e8]" href="#prestations">Services</a>
          <a class="hover:text-[#f5f0e8]" href="#galerie">Studio</a>
          <a class="hover:text-[#f5f0e8]" href="#contact">Contact</a>
          <a
            class="rounded-full bg-[#f5f0e8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white"
            href="#contact"
          >
            Réserver
          </a>
        </nav>

        <button
          class="rounded-full border border-[#f5f0e8]/15 bg-black px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f5f0e8] md:hidden"
          type="button"
          @click="navOpen = !navOpen"
        >
          Menu
        </button>
      </div>

      <div v-if="navOpen" class="border-t border-[#f5f0e8]/10 bg-[#050505] md:hidden">
        <div class="mx-auto grid max-w-7xl gap-2 px-5 py-5 text-sm text-[#f5f0e8]/80">
          <a class="py-2 hover:text-[#f5f0e8]" href="#apropos" @click="navOpen = false">Concept</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#prestations" @click="navOpen = false">Services</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#galerie" @click="navOpen = false">Studio</a>
          <a class="py-2 hover:text-[#f5f0e8]" href="#contact" @click="navOpen = false">Contact</a>
          <a
            class="mt-2 inline-flex w-fit rounded-full bg-[#f5f0e8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black"
            href="#contact"
            @click="navOpen = false"
          >
            Réserver
          </a>
        </div>
      </div>
    </header>

    <main id="top" class="relative z-10 pt-20">
      <section class="relative">
        <div class="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-16 md:py-28">
          <div class="max-w-5xl">
            <p data-hero class="text-xs font-semibold uppercase tracking-[0.32em] text-[#f5f0e8]/60">Massage • Recovery • Performance</p>
            <h1
              data-hero
              class="mt-6 max-w-5xl text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.06em] md:text-8xl lg:text-9xl"
            >
              Move better.
              <span class="block text-[#f5f0e8]/55">Recover deeper.</span>
            </h1>
            <p data-hero class="mt-8 max-w-2xl text-lg leading-relaxed text-[#f5f0e8]/70">
              Une expérience premium dédiée à la récupération, à la mobilité et au bien-être du corps. Des séances ciblées,
              simples à réserver, pensées pour accompagner ton rythme et tes objectifs.
            </p>
            <div data-hero class="mt-10 flex flex-wrap items-center gap-3">
              <a
                class="rounded-full bg-[#f5f0e8] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white"
                href="#contact"
              >
                Prendre rendez-vous
              </a>
              <a
                class="rounded-full border border-[#f5f0e8]/20 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                href="#prestations"
              >
                Découvrir
              </a>
            </div>

            <div data-hero class="mt-14 grid gap-3 text-sm text-[#f5f0e8]/70 sm:grid-cols-3">
              <div class="border-y border-[#f5f0e8]/10 py-5">
                <p class="text-xs uppercase tracking-[0.22em] text-[#f5f0e8]/45">01</p>
                <p class="mt-3 font-medium text-[#f5f0e8]">Recovery</p>
                <p class="mt-1">Sport, détente, mobilité</p>
              </div>
              <div class="border-y border-[#f5f0e8]/10 py-5">
                <p class="text-xs uppercase tracking-[0.22em] text-[#f5f0e8]/45">02</p>
                <p class="mt-3 font-medium text-[#f5f0e8]">Performance</p>
                <p class="mt-1">Prévention, préparation, retour à l’effort</p>
              </div>
              <div class="border-y border-[#f5f0e8]/10 py-5">
                <p class="text-xs uppercase tracking-[0.22em] text-[#f5f0e8]/45">03</p>
                <p class="mt-3 font-medium text-[#f5f0e8]">Booking</p>
                <p class="mt-1">Calendly, contact rapide, suivi clair</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apropos" class="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div data-reveal class="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">Concept</p>
            <h2 class="mt-5 max-w-3xl text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
              Un espace dédié au corps en mouvement.
            </h2>
            <p class="mt-7 max-w-xl leading-relaxed text-[#f5f0e8]/70">
              Chaque séance est construite pour répondre à un besoin concret : relâcher une zone tendue, améliorer la
              récupération, ou simplement te remettre bien dans ton corps.
            </p>
          </div>
          <div class="grid gap-4">
            <div class="border border-[#f5f0e8]/10 bg-[#0b0b0b] p-6">
              <p class="text-xs uppercase tracking-[0.24em] text-[#f5f0e8]/45">Mission</p>
              <p class="mt-4 text-lg font-medium text-[#f5f0e8]">Améliorer ton confort au quotidien et t’aider à bouger sans gêne.</p>
            </div>
            <div class="border border-[#f5f0e8]/10 bg-[#0b0b0b] p-6">
              <p class="text-xs uppercase tracking-[0.24em] text-[#f5f0e8]/45">Objectifs</p>
              <p class="mt-4 text-lg font-medium text-[#f5f0e8]">Prévenir les douleurs, optimiser la mobilité et soutenir la performance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prestations" class="border-y border-[#f5f0e8]/10 bg-[#f5f0e8] text-black">
        <div class="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div data-reveal class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">Services</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">Train. Recover. Reset.</h2>
            <p class="mt-7 leading-relaxed text-black/65">
              Des formats simples, avec une intention précise pour chaque séance.
            </p>
          </div>

          <div class="mt-12 grid border-t border-black/15 md:grid-cols-2">
            <article data-reveal class="border-b border-black/15 py-8 md:border-r md:pr-8">
              <p class="text-xs uppercase tracking-[0.24em] text-black/45">01</p>
              <h3 class="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">Massage Sportif</h3>
              <p class="mt-3 text-black/65">Récupération musculaire, tensions, préparation / retour d’effort.</p>
              <p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">Disponible</p>
            </article>
            <article data-reveal class="border-b border-black/15 py-8 md:pl-8">
              <p class="text-xs uppercase tracking-[0.24em] text-black/45">02</p>
              <h3 class="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">Cupping Therapy</h3>
              <p class="mt-3 text-black/65">Ventouses pour relâcher les adhérences et améliorer la souplesse.</p>
              <p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">Sur demande</p>
            </article>
            <article data-reveal class="border-b border-black/15 py-8 md:border-r md:pr-8">
              <p class="text-xs uppercase tracking-[0.24em] text-black/45">03</p>
              <h3 class="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">Préparation Physique</h3>
              <p class="mt-3 text-black/65">Programme sur mesure selon tes objectifs et ton niveau.</p>
              <p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">Bientôt</p>
            </article>
            <article data-reveal class="border-b border-black/15 py-8 md:pl-8">
              <p class="text-xs uppercase tracking-[0.24em] text-black/45">04</p>
              <h3 class="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">Ostéo Massage</h3>
              <p class="mt-3 text-black/65">Travail ciblé pour la mobilité et les zones sensibles.</p>
              <p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/55">Disponible</p>
            </article>
          </div>
        </div>
      </section>

      <section id="galerie" class="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div data-reveal class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">Studio</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">Ambiance & séances</h2>
          </div>
          <p class="text-sm text-[#f5f0e8]/60">Photos utilisées : dossier Francis</p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="src in galleryPhotos"
            :key="src"
            data-reveal
            class="group relative overflow-hidden border border-[#f5f0e8]/10 bg-[#0b0b0b]"
          >
            <img
              class="h-72 w-full object-cover object-[50%_20%] grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              :src="src"
              alt=""
            />
          </div>
        </div>
      </section>

      <section id="contact" class="border-t border-[#f5f0e8]/10 bg-[#050505]">
        <div class="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div data-reveal>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f0e8]/55">Booking</p>
            <h2 class="mt-5 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">Book your session.</h2>
            <p class="mt-7 max-w-xl leading-relaxed text-[#f5f0e8]/70">
              Dis-moi ce dont tu as besoin (zone, douleur, objectif). Je te propose un créneau et un format adapté.
            </p>
            <div class="mt-10 border border-[#f5f0e8]/10 bg-black p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f0e8]/60">Calendrier</p>
              <p class="mt-2 text-sm text-[#f5f0e8]/70">Choisis un créneau directement dans le calendrier.</p>
              <div class="mt-4 overflow-hidden border border-[#f5f0e8]/10 bg-black">
                <iframe
                  class="block h-[720px] w-full"
                  :src="calendlyEmbedUrl"
                  title="Calendrier de réservation"
                  frameborder="0"
                />
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <a
                  class="rounded-full border border-[#f5f0e8]/20 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                  :href="calendlyUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir en plein écran
                </a>
              </div>
            </div>
          </div>

          <div data-reveal class="border border-[#f5f0e8]/10 bg-black p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5f0e8]/60">Formulaire de contact</p>
            <p class="mt-3 text-sm text-[#f5f0e8]/70">
              Tu peux envoyer un message, même si tu ne trouves pas de créneau parfait.
            </p>

            <form class="mt-5 grid gap-4" @submit.prevent="submitContact">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-[#f5f0e8]/80" for="name">Nom</label>
                <input
                  id="name"
                  v-model="form.name"
                  class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                  type="text"
                  autocomplete="name"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-[#f5f0e8]/80" for="email">Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                    type="email"
                    autocomplete="email"
                    placeholder="vous@email.com"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <label class="text-sm font-medium text-[#f5f0e8]/80" for="phone">Téléphone (optionnel)</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    class="h-12 border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                    type="tel"
                    autocomplete="tel"
                    placeholder="+32 ..."
                  />
                </div>
              </div>

              <div class="grid gap-2">
                <label class="text-sm font-medium text-[#f5f0e8]/80" for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="min-h-[120px] resize-y border border-[#f5f0e8]/10 bg-[#0b0b0b] px-4 py-3 text-sm text-[#f5f0e8] outline-none ring-[#f5f0e8]/30 placeholder:text-[#f5f0e8]/35 focus:ring-2"
                  placeholder="Expliquez votre besoin (douleurs, zone, objectif, disponibilité…)"
                  required
                />
              </div>

              <button
                class="inline-flex h-12 items-center justify-center rounded-full bg-[#f5f0e8] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                :disabled="!canSubmit"
              >
                <span v-if="submitState === 'sending'">Envoi…</span>
                <span v-else>Envoyer</span>
              </button>

              <p v-if="submitState === 'success'" class="text-sm text-[#f5f0e8]/70">Message envoyé.</p>
              <p v-else-if="submitState === 'error'" class="text-sm text-[#f5f0e8]/70">
                Impossible d’envoyer le message. Réessaie ou contacte directement par email.
              </p>
            </form>

            <div class="mt-8 grid gap-4 text-sm text-[#f5f0e8]/80">
              <div>
                <p class="font-medium text-[#f5f0e8]">Adresse</p>
                <p class="mt-1 text-[#f5f0e8]/70">Ixelles, Bruxelles</p>
              </div>
              <div>
                <p class="font-medium text-[#f5f0e8]">Email</p>
                <p class="mt-1 text-[#f5f0e8]/70">contact@exemple.com</p>
              </div>
              <div>
                <p class="font-medium text-[#f5f0e8]">Réseaux</p>
                <p class="mt-1 text-[#f5f0e8]/70">Instagram / LinkedIn / Facebook</p>
              </div>
              <div class="pt-2">
                <a
                  class="inline-flex rounded-full border border-[#f5f0e8]/20 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f0e8] hover:bg-[#111]"
                  href="#top"
                >
                  Retour en haut
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer class="border-t border-[#f5f0e8]/10">
          <div class="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-[#f5f0e8]/55 md:flex-row md:items-center md:justify-between">
            <p>© {{ new Date().getFullYear() }} Francis Massage. Tous droits réservés.</p>
            <p>Mentions légales</p>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>

