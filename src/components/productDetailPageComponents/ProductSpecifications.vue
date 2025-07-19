<template>
  <div class="mt-10 flex flex-col justify-center items-center" v-if="!store.loading">
    <h2 class="text-xl font-extrabold mb-6 text-center text-gray-800">مشخصات محصول</h2>

    <div class="overflow-x-auto rounded shadow border border-gray-200 min-w-[40%]">
      <table class=" text-sm text-gray-700 min-w-full">
        <tbody>
          <tr
            v-for="spec in specifications"
            :key="spec.id"
            class="odd:bg-gray-100 even:bg-gray-200 border-b border-gray-100 transition hover:font-extrabold"
          >
            <td class="py-3 px-4  text-gray-900 select-none">{{ spec.label }}</td>
            <td class="py-3 px-4 text-gray-700 select-none">{{ getSpecificationValue(spec) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../stores/productDetails'

const store = useProductStore()

const specifications = computed(() => store.productSpecifications)

function getSpecificationValue(spec) {
  const pivot = spec.pivot

  if (pivot?.value) return pivot.value

  if (pivot?.specification_value?.value) return pivot.specification_value.value

  if (Array.isArray(pivot?.specification_values) && pivot.specification_values.length > 0) {
    return pivot.specification_values
      .map((v) => v?.value)
      .filter(Boolean)
      .join(' - ')
  }

  return '—'
}
</script>

<style scoped>
</style>
