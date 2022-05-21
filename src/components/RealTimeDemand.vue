<script setup>
import { reactive, onMounted } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseFieldInput from '@/components/widgets/BaseFieldInput.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import axios from 'axios'
import dayjs from 'dayjs'


const state = reactive({
  isLoading: true,
})

const electricData = reactive({})

async function fetchRealTimeElectricData () {
  const today = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
  const now = dayjs().format('YYYY-MM-DDTHH:MM')

  try {
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/demanda/demanda-tiempo-real?start_date=${today}&end_date=${now}&time_trunc=hour`)
    Object.assign(electricData, data)
    console.info(data, 'DATA')
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

onMounted(async () => await fetchRealTimeElectricData())
</script>

<template>
  <base-loader v-if="state.isLoading" />
  
  <data-card v-else :title="electricData.data.attributes.title">
    <div class="grid grid--3cols">
      <div v-for="demandData in electricData.included" :key="demandData.id">
        <p> {{ demandData.type }}</p>
        <div v-for="attribute in demandData.attributes.values.slice(-5)" :key="attribute.datetime" class="grid grid--3cols">
          <base-field label="Fecha">
            <span clas="label">{{ $d(attribute.datetime, 'longDayMonthHour') }}</span>
          </base-field>
          <base-field label="Valor">
            {{ attribute.value }}
          </base-field>
          <base-field label="Porcentaje">
            {{ attribute.percentage.toFixed(2) }}
          </base-field>
        </div>
      </div>
    </div>
  </data-card>
</template>