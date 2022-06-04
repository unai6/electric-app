<script setup>
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import BaseModal from '@/components/widgets/BaseModal.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

import axios from 'axios'
import dayjs from 'dayjs'

const state = reactive({
  isLoading: true,
  electricData: {},
  pvpcData: {},
  chartData: null,
  charTitle: '',
  isChartVisible: false,
})

const getHours = computed(() => {
  let hours = []
  for (let i = 1; i <= 11; i++) {
    hours.push(`${i}:00`)
  }
  return hours
})

async function fetchRealTimeElectricData () {
  const today = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
  const todayEndDay = dayjs().hour(24).format('YYYY-MM-DDTHH:MM')

  try {
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${today}&end_date=${todayEndDay}&time_trunc=hour`)
    state.electricData = data
  
    const [pvpc, _] = state.electricData.included
    state.pvpcData = pvpc

    state.chartData = {
      labels: getHours.value,
      datasets: [
        {
          responsive: true,
          label: state.pvpcData.attributes.title,
          data: state.pvpcData.attributes.values.map(attribute => attribute.value),
          backgroundColor: state.pvpcData.attributes.color,
        },
      ],
    }
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

onMounted(async () => await fetchRealTimeElectricData())

onBeforeUnmount(() => clearInterval(interval))

const interval = setInterval(fetchRealTimeElectricData, 1000 * 1000)

function openModal () {
  state.isChartVisible = true
}

function getTitleAndDate (title) {
  state.chartTitle = title
  return `${title} ${dayjs().format('DD-MM-YYYY')}`
}

function getAttributeValues (value) {
  console.info(value, 'value')
}

</script>

<template>
  <base-loader v-if="state.isLoading" />
  <div v-else class="insular-price">
    <button class="button button--secondary" @click="openModal">
      Ver Gráfico
    </button> 
    <data-card :title="state.electricData.data.attributes.title">
      <div class="grid grid--2cols">
        <base-field :label="getTitleAndDate(state.pvpcData.type)">
          <p v-for="attribute in state.pvpcData.attributes.values" :key="attribute.id" class="label" @load="getAttributeValues(attribute.value)">
            {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
          </p>
        </base-field>
      </div>
    </data-card>
    <base-modal
      v-model="state.isChartVisible"
      with-close-tag
      :with-actions="false"
      :title="state.chartTitle"
    >
      <template #body>
        <line-chart class="insular-price__chart" :chart-data="state.chartData" />
      </template>
    </base-modal>
  </div>
</template>


<style lang="scss">
.insular-price {

  &__chart {
    height: 50vh;
  }
}
</style>
