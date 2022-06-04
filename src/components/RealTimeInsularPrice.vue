<script setup>
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import BaseModal from '@/components/widgets/BaseModal.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import { LineChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from "chart.js"

import { useToast } from 'vue-toastification'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

const toast = useToast()

const state = reactive({
  isLoading: true,
  electricData: {},
  pvpcData: {},
  spotData: {},
  chartData: null,
  charTitle: '',
  isChartVisible: false,
})

const xsBreakpoint = 649 // This var will be used only in this component for the moment. Move to a config file if necessary in the future.
const isMobile = computed(() => window.innerWidth <= xsBreakpoint)

onMounted(async () => await fetchRealTimeElectricData())

onBeforeUnmount(() => clearInterval(interval))

const interval = setInterval(fetchRealTimeElectricData, 1000 * 1000)

async function fetchRealTimeElectricData () {
  const today = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
  const todayEndDay = dayjs().hour(24).format('YYYY-MM-DDTHH:MM')

  try {
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${today}&end_date=${todayEndDay}&time_trunc=hour`)
    state.electricData = data
    state.chartData = processData(state.electricData.included)
  } catch (err) {
    if (err) {
      console.error(err)
      toast.error('Ha habido un error al procesar los datos. Por favor vuelve a intentarlo.')
    }
  } finally {
    state.isLoading = false
  }
}

function processData (data) {
  const [pvpc, spot] = data

  const hours = Array(24).fill().map((_, index) => `${index + 1}:00`)

  return {
    labels: hours,
    datasets: [
      {
        responsive: true,
        label: pvpc.attributes.title,
        data: pvpc.attributes.values.map(attribute => attribute.value),
        backgroundColor: pvpc.attributes.color,
      },
      {
        responsive: true,
        label: spot.attributes.title,
        data: spot.attributes.values.map(attribute => attribute.value),
        backgroundColor: spot.attributes.color,
      },
    ],
  }
}

function openModal () {
  state.isChartVisible = true
}

function getTitleAndDate (title) {
  return `${title} - ${dayjs().format('DD-MM-YYYY')}`
}

const pricesValues = computed(() => state.electricData.included.map(data => ({
  minValue: Math.max(data.attributes.values.map(at => at.value).reduce((acc, c) => acc < c ? acc : c), 0),
  maxValue: Math.max(data.attributes.values.map(at => at.value).reduce((acc, c) => acc > c ? acc : c), 0),
  mean: Math.round(data.attributes.values.map(at => at.value).reduce((acc, c) => acc + c) / data.attributes.values.length),
  id: data.id,
})))


function getClassModifier (value, id) {
  return pricesValues.value.map(data => {
    if (data.id === id) {
      return data.maxValue - (data.maxValue * 0.10) < value ? 'insular__price--expensive' : value < data.maxValue && value >= data.mean ? 'insular__price--regular' : 'insular__price--cheap'
    }
  })
}

</script>

<template>
  <base-loader v-if="state.isLoading" />
  <div v-else class="insular">
    <data-card :title="state.electricData.data.attributes.title">
      <button class="button button--secondary button--nomargin" @click="openModal">
        Ver Gráfico
      </button>
      <div class="grid grid--2cols top-spacer-large">
        <base-field v-for="data in state.electricData.included" :key="data">
          <h5>{{ getTitleAndDate(data.type) }}</h5>
          <p v-for="attribute in data.attributes.values" :key="attribute.id" class="label insular__price" :class="getClassModifier(attribute.value, data.id)">
            {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
          </p>
        </base-field> 
      </div>
    </data-card>
    <base-modal
      v-model="state.isChartVisible"
      with-close-tag
      :with-actions="false"
      :title="state.electricData.data.attributes.title"
    >
      <template #body>
        <bar-chart v-if="isMobile" class="insular__chart" :chart-data="state.chartData" />
        <line-chart v-else class="insular__chart" :chart-data="state.chartData" />
      </template>
    </base-modal>
  </div>
</template>


<style lang="scss">
.insular {

  &__chart {
    height: 50vh;
  }

  &__price {
    color: $white-color;
    border: none;
    padding: $spacer*0.5;
    border-radius: $small-radius;

    &--cheap {
      background: $success-color;
    }

    &--regular {
      background: $warning-color;
    }

    &--expensive {
      background: $danger-color;
    }
  }
}
</style>
