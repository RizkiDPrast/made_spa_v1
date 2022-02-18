<template>
  <q-btn
    v-if="model && model !== null && model.length"
    target="_blank"
    flat
    round
    dense
    text-color="green"
    icon="la la-whatsapp"
    type="a"
    :href="`https://wa.me/${model}?text=${encodedText}`"
    v-bind="$attrs"
    :class="encodedText && encodedText.length ? '' : ''"
    :style="
      encodedText && encodedText.length
        ? 'position:absolute;bottom:18px;right:0'
        : ''
    "
  >
    <q-tooltip
      v-if="encodedText && encodedText.length"
      content-class="bg-positive"
    >
      Kirim WA dengan konten ini
    </q-tooltip>
  </q-btn>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => undefined
    },
    text: {
      type: String,
      default: () => undefined
    }
  },
  computed: {
    model() {
      if (!this.value || this.value === null || !this.value.replace) return "";
      let model = this.value;
      model = model.replace(/^(0)*/, "62").replace(/\D/g, "");
      return model;
    },
    encodedText() {
      if (!this.text || this.text === null) return "";
      return window.encodeURIComponent(this.text);
    }
  }
};
</script>
