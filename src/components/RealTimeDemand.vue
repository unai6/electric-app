<script setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
// import BaseFieldInput from '@/components/widgets/BaseFieldInput.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import axios from 'axios'
import dayjs from 'dayjs'

const state = reactive({
  isLoading: true,
})

const electricData = reactive({})

async function fetchRealTimeElectricData () {
  console.info('called')
  const today = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
  const now = dayjs().format('YYYY-MM-DDTHH:MM')

  try {
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${today}&end_date=${now}&time_trunc=hour`)
    Object.assign(electricData, data)
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

onMounted(async () => await fetchRealTimeElectricData())

onBeforeUnmount(() => clearInterval(interval))

const interval = setInterval(fetchRealTimeElectricData, 1000 * 1000)

function getTitleAndDate (title) {
  return `${title} ${dayjs().format('DD-MM-YYYY')}`
}
</script>

<template>
  <base-loader v-if="state.isLoading" />
  <data-card v-else :title="electricData.data.attributes.title">
    <div class="grid grid--2cols">
      <base-field v-for="data in electricData.included" :key="data.id" :label="getTitleAndDate(data.type)">
        <p v-for="attribute in data.attributes.values" :key="attribute.id" class="label">
          {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
        </p>
      </base-field>
    </div>
  </data-card>
</template>