<script setup>
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import BaseModal from '@/components/widgets/BaseModal.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import i18n from '@/lang/i18n'

import { Line as LineChart } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

import { useToast } from 'vue-toastification'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

const { n }  = i18n.global || i18n

const toast = useToast()

const state = reactive({
  isLoading: true,
  isLoadingChart: false,
  electricData: {},
  chartData: null,
  chartOptions: {
    pointBackgroundColor: 'transparent',
    responsive: true,
    borderWidth: 3,
  },
  isChartVisible: false,
})

const xsBreakpoint = 649 // This var will be used only in this component for the moment. Move to a config file if necessary in the future.
const isMobile = computed(() => window.innerWidth <= xsBreakpoint)

onMounted(async () => {
  await fetchRealTimeElectricData('daily')
})

onBeforeUnmount(() => clearInterval(interval))

const interval = setInterval(fetchRealTimeElectricData, 1000 * 1000)

async function fetchRealTimeElectricData (timeRange) {
  let startDate, endDate

  switch (timeRange) {
    case 'daily': {
      startDate = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
      endDate =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'weekly': {
      startDate = dayjs().startOf('week').format('YYYY-MM-DDTHH:MM')
      endDate =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'monthly': {
      startDate = dayjs().startOf('month').format('YYYY-MM-DDTHH:MM')
      endDate =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    default: {
      // This will apply to daily stats
      startDate = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
      endDate =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
  }

  try {
    state.isLoadingChart = true

    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${startDate}&end_date=${endDate}&time_trunc=hour`)
    state.electricData = data
    state.chartData = processData(state.electricData.included)
  } catch (err) {
    if (err) {
      console.error(err)
      toast.error('Ha habido un error al procesar los datos. Por favor vuelve a intentarlo.')
    }
  } finally {
    state.isLoadingChart = false
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
        backgroundColor: spot.attributes.color,
        borderColor: spot.attributes.color,
        fill: false,
      },
      {
        label: pvpc.attributes.title,
        data: pvpc.attributes.values.map(attribute => attribute.value),
        backgroundColor: pvpc.attributes.color,
        borderColor: pvpc.attributes.color,
        fill: false,
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

function getIsCurrentTime (datetime) {
  const parsedDateTime = dayjs(datetime).format('H')
  const now = dayjs().format('H')
  return parsedDateTime === now ? String.fromCodePoint(0x1F551) : null
}

</script>

<template>
  <base-loader v-if="state.isLoading" />
  <div v-else class="insular">
    <data-card :title="state.electricData.data.attributes.title">
      <button class="button button--outline-secondary button--nomargin" @click="openModal">
        Ver gráfico
      </button>
      <div class="grid grid--2cols">
        <base-field v-for="data in state.electricData.included" :key="data">
          <h5>{{ data.type }}</h5>
          <div class="buttonset buttonset--spaced">
            <button class="button button--is-danger insular__stat">
              Máximo <br>{{ getRefferencePricesByCollection(data.attributes.values).max }}
            </button>
            <button class="button button--is-warning insular__stat">
              Medio <br>{{ getRefferencePricesByCollection(data.attributes.values).average }}
            </button>
            <button class="button button--success insular__stat">
              Mínimo <br>{{ getRefferencePricesByCollection(data.attributes.values).min }}
            </button>
          </div>
          <div v-for="attribute in data.attributes.values" :key="attribute.id">
            <p class="insular__price text-align-centered" :class="getClassModifier(attribute.value, data.id)">
              {{ getIsCurrentTime(attribute.datetime) }} {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
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
        <div class="buttonset">
          <button class="button button--outline-secondary bottom-spacer" @click="fetchRealTimeElectricData('daily')">
            Diario
          </button>
          <button class="button button--outline-secondary bottom-spacer" @click="fetchRealTimeElectricData('weekly')">
            Semanal
          </button>
          <button class="button button--outline-secondary bottom-spacer" @click="fetchRealTimeElectricData('monthly')">
            Mensual
          </button>
        </div>
        <line-chart
          v-if="!state.isLoading"
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

  &__stat {
    font-weight: $font-weight-bold;
  }

  &__price {
    font-size: ms(0);
    font-weight: $font-weight-regular;
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
