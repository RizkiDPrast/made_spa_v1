<template>
  <q-td align="center" class="q-gutter-xs">
    <template v-if="$q.screen.gt.sm">
      <slot> </slot>
      <q-btn
        text-color="primary"
        :icon="editBtnIcon"
        round
        size="sm"
        @click="edit"
        :class="editBtnClass"
      >
        <q-tooltip content-class="bg-primary">
          Edit
        </q-tooltip>
      </q-btn>
      <q-btn
        text-color="negative"
        icon="las la-trash"
        round
        size="sm"
        @click="del"
        :class="deleteBtnClass"
      >
        <q-tooltip content-class="bg-negative">
          Delete
        </q-tooltip>
      </q-btn>
    </template>
    <template v-else>
      {{ $slots.sco }}
      <q-btn icon="las la-ellipsis-v" round flat size="sm">
        <q-menu>
          <q-list dense>
            <slot name="mobile"> </slot>
            <q-item>
              <q-btn
                text-color="primary"
                :icon="editBtnIcon"
                flat
                size="sm"
                @click="edit"
                :class="editBtnClass"
                label="Edit"
              ></q-btn>
            </q-item>
            <q-item>
              <q-btn
                text-color="negative"
                icon="las la-trash"
                flat
                size="sm"
                @click="del"
                :class="deleteBtnClass"
                label="Delete"
              >
              </q-btn>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <slot></slot>
    </template>
  </q-td>
</template>
<script>
export default {
  props: {
    id: {
      type: [String, Number],
      default: () => 0
    },
    name: {
      type: String,
      default: () => ""
    },
    deleteBtnClass: {
      type: String,
      default: () => ""
    },
    editBtnClass: {
      type: String,
      default: () => ""
    },
    editBtnIcon: {
      type: String,
      default: () => "las la-pen-alt"
    }
  },
  methods: {
    edit() {
      this.$emit("edit", this.id);
    },
    del() {
      let id = this.id;
      if (!id) return;
      this.$q
        .dialog({
          title: "Confirm",
          message: `Are you sure want to delete ${this.name} (id = ${id})?`,
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.$emit("delete", id);
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>
