<script setup>
import { reactive, onMounted, onBeforeUnmount, computed, ref } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import BaseModal from '@/components/widgets/BaseModal.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import { Line as LineChart } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import i18n from '@/lang/i18n'

import { useToast } from 'vue-toastification'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

const { n }  = i18n.global || i18n

const toast = useToast()

const state = reactive({
  isLoading: true,
  electricData: {},
  chartData: null,
  charTitle: '',
  chartOptions: {
    pointBackgroundColor: 'transparent',
    responsive: true,
    borderColor: 'lightGray',
    borderWidth: 2,
  },
  isChartVisible: false,
})

const lineChartRef = ref()

const xsBreakpoint = 649 // This var will be used only in this component for the moment. Move to a config file if necessary in the future.
const isMobile = computed(() => window.innerWidth <= xsBreakpoint)

onMounted(async () => {
  await fetchRealTimeElectricData()
})


// TODO: If this function is used anywhere else, place it into a config file.
function hexToRGBA(hex, opacity) {
  let r = 0, g = 0, b = 0

  // 3 digits
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1]
    g = "0x" + hex[2] + hex[2]
    b = "0x" + hex[3] + hex[3]

  // 6 digits
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2]
    g = "0x" + hex[3] + hex[4]
    b = "0x" + hex[5] + hex[6]
  }
  return `rgba(${+r},${+g},${+b},${opacity})`
}

function getGradient (context) {
  if (context) {
    const chart = context.chart
    const { ctx } = chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 1000)
    gradient.addColorStop(0, hexToRGBA(context.dataset.color, context.dataset.opacity[0]))
    gradient.addColorStop(0.6, hexToRGBA(context.dataset.color, context.dataset.opacity[1]))
    gradient.addColorStop(1, hexToRGBA(context.dataset.color, context.dataset.opacity[2]))

    return gradient
  }
}

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
        label: spot.attributes.title,
        data: spot.attributes.values.map(attribute => attribute.value),
        backgroundColor: getGradient,
        color: spot.attributes.color,
        borderColor: 'transparent',
        fill: true,
        opacity: [0.9, 0.75, 0],
        tension: 0.3,
      },
      {
        label: pvpc.attributes.title,
        data: pvpc.attributes.values.map(attribute => attribute.value),
        backgroundColor: getGradient,
        color: pvpc.attributes.color,
        borderColor: 'transparent',
        fill: true,
        opacity: [0.9, 0.5, 0],
        tension: 0.3,
      },
    ],
  }
}

function openModal () {
  state.isChartVisible = true
}

const getGlobalRefferencePrices = computed(() => state.electricData.included.map(data => ({
  max: data.attributes.values.map(at => at.value).reduce((acc, c) => acc > c ? acc : c),
  average: data.attributes.values.map(at => at.value).reduce((acc, c) => acc + c) / data.attributes.values.length,
  id: data.id,
})))

console.info(getGlobalRefferencePrices)

function getClassModifier (value, id) {
  return getGlobalRefferencePrices.value.map(data => {
    if (data.id === id) {
      return data.max - (data.max * 0.10) < value 
        ? 'insular__price--expensive' 
        : value < data.max && value >= data.average 
          ? 'insular__price--regular' 
          : 'insular__price--cheap'
    }
  })
}

function getRefferencePricesByCollection (attributes) {
  return {
    max: n(Math.max(...attributes.map(att => att.value)), 'currency'),
    average: n(attributes.map(at => at.value).reduce((acc, c) => acc + c) / attributes.length, 'currency'),
    min: n(attributes.map(at => at.value).reduce((acc, c) => acc < c ? acc : c), 'currency'),
  }
}
</script>

<template>
  <base-loader v-if="state.isLoading" />
  <div v-else class="insular">
    <data-card :title="`${state.electricData.data.attributes.title} - ( ${$d(new Date, 'longDayMonthHour').toUpperCase()} )`">
      <button class="button button--secondary button--nomargin" @click="openModal">
        Ver Gráfico
      </button>
      <div class="grid grid--2cols top-spacer-large">
        <base-field v-for="data in state.electricData.included" :key="data">
          <h5>{{ data.type }}</h5>
          <div class="buttonset buttonset--spaced">
            <button class="button button--is-danger">
              Máximo <br>{{ getRefferencePricesByCollection(data.attributes.values).max }}
            </button>
            <button class="button button--is-warning">
              Medio <br>{{ getRefferencePricesByCollection(data.attributes.values).average }}
            </button>
            <button class="button button--success">
              Mínimo <br>{{ getRefferencePricesByCollection(data.attributes.values).min }}
            </button>
          </div>
          <div v-for="attribute in data.attributes.values" :key="attribute.id">
            <p class="label insular__price" :class="getClassModifier(attribute.value, data.id)">
              {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
            </p>
          </div>
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
        <line-chart
          ref="lineChartRef"
          css-classes="insular__chart"
          :chart-data="state.chartData"
          :chart-options="state.chartOptions"
          :height="isMobile ? 400 : 150"
        /> 
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
