<script setup>
import { reactive, onMounted, onBeforeUnmount, computed } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import BaseField from '@/components/widgets/BaseField.vue'
import BaseModal from '@/components/widgets/BaseModal.vue'
import DataCard from '@/components/widgets/DataCard.vue'

import i18n from '@/lang/i18n'
import { useToast } from 'vue-toastification'

import { Line as LineChart } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

const { n, d }  = i18n.global || i18n

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

const date = reactive({
  start: '',
  end: '',
  timeTrunc: 'daily',
})

const xsBreakpoint = 649 // This var will be used only in this component for the moment. Move to a config file if necessary in the future.
const isMobile = computed(() => window.innerWidth <= xsBreakpoint)

onMounted(async () => {
  await fetchRealTimeElectricData('daily')
})

onBeforeUnmount(() => clearInterval(interval))

const interval = setInterval(fetchRealTimeElectricData, 1000 * 1000)

async function fetchRealTimeElectricData (timeTrunc) {
  date.timeTrunc = timeTrunc

  switch (timeTrunc) {
    case 'daily': {
      date.start = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'weekly': {
      date.start = dayjs().subtract(6, 'day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'monthly': {
      date.start = dayjs().subtract(29, 'day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    default: {
      // This will apply to daily stats
      date.start = dayjs().startOf('day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
  }

  try {
    state.isLoadingChart = true

    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${date.start}&end_date=${date.end}&time_trunc=hour`)
    state.electricData = data
    state.chartData = processData(state.electricData.included)
  } catch (err) {
    if (err) {
      console.error(err)
      toast.error('Ha habido un error al procesar los datos. Por favor vuelve a intentarlo.')
    }
  } finally {
    state.isLoading = false
    state.isLoadingChart = false
  }
}

function processData (data) {
  const [pvpc, spot] = data

  const hours = Array(24).fill().map((_, index) => `${index + 1}:00`)
  
  const getCollectionValues = (param) => {
    const groups = param.attributes.values.reduce((acc, c) => {
      const date = c.datetime.split('T')[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(c.value)
      return acc
    }, {})

    for (const [key, value] of Object.entries(groups)) {
      // If max value wnated
      // groups[key] = Math.max(...value)

      // If average wanted
      groups[key] = value.reduce((acc, c) => acc + c) / value.length
    }
    return groups
  }

  const days = Object.keys(getCollectionValues(pvpc)).map(date => dayjs(date).format('D MMM'))
  return {
    labels: date.timeTrunc === 'daily' ? hours : days,
    datasets: [
      {
        label: spot.attributes.title,
        data: date.timeTrunc === 'daily' ? spot.attributes.values.map(attribute => attribute.value) : Object.values(getCollectionValues(spot)),
        backgroundColor: spot.attributes.color,
        borderColor: spot.attributes.color,
        fill: false,
      },
      {
        label: pvpc.attributes.title,
        data: date.timeTrunc === 'daily' ? pvpc.attributes.values.map(attribute => attribute.value) : Object.values(getCollectionValues(pvpc)),
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
        : (value < data.max) && (value >= data.average) 
          ? 'insular__price--regular' 
          : 'insular__price--cheap'
    }
  })
}

function getRefferencePricesByCollection (attributes) {
  return {
    max: { value: n(Math.max(...attributes.map(att => att.value)), 'currency') },
    average: { value: n(attributes.map(at => at.value).reduce((acc, c, _, { length }) => acc + (c / length), 0), 'currency') },
    min: { value: n(Math.min(...attributes.map(att => att.value)), 'currency') },
  }
}

const getIsCurrentTime = computed(() => datetime => {
  const parsedDateTime = dayjs(datetime).format('H')
  const now = dayjs().format('H')
  return parsedDateTime === now ? String.fromCodePoint(0x1F551) : null
})

const getCurrentDayMonth = computed(() => attributeDateTime =>  date.timeTrunc !== 'daily' ? d(attributeDateTime, 'shortNumeric') : null)

const computedChartDate = computed(() => date.start && date.end && date.timeTrunc === 'daily' 
  ? `${d(date.start, 'daymonth')} - ${d(date.end, 'daymonth')}`
  : `Precio medio ${d(date.start, 'daymonth')} - ${d(date.end, 'daymonth')}`,
)
</script>

<template>
  <base-loader v-if="state.isLoading" />
  <div v-else class="insular">
    <data-card :title="state.electricData.data.attributes.title" :is-loading="state.isLoadingChart">
      <button class="button button--outline-secondary button--nomargin" @click="openModal">
        Ver gráfico
      </button>
      <div class="buttonset top-spacer">
        <button class="button button--nomargin" :class="{ 'button--active': date.timeTrunc === 'daily' }" @click="fetchRealTimeElectricData('daily')">
          Diario
        </button>
        <button class="button" :class="{ 'button--active': date.timeTrunc === 'weekly' }" @click="fetchRealTimeElectricData('weekly')">
          Semanal
        </button>
        <button class="button button--nomargin" :class="{ 'button--active': date.timeTrunc === 'monthly' }" @click="fetchRealTimeElectricData('monthly')">
          Mensual
        </button>
      </div>

      <div class="grid grid--2cols">
        <base-field v-for="data in state.electricData.included" :key="data">
          <h5>{{ data.type }}</h5>
          <div class="insular__stats">
            <p class="insular__stat insular__stat--danger">
              Máximo <br>{{ getRefferencePricesByCollection(data.attributes.values).max.value }}
            </p>
            <p class="insular__stat insular__stat--warning">
              Medio <br>{{ getRefferencePricesByCollection(data.attributes.values).average.value }}
            </p>
            <p class="insular__stat insular__stat--success">
              Mínimo <br>{{ getRefferencePricesByCollection(data.attributes.values).min.value }}
            </p>
          </div>
          <div v-for="attribute in data.attributes.values" :key="attribute.id">
            <p class="insular__price text-align-centered" :class="getClassModifier(attribute.value, data.id)">
              {{ getIsCurrentTime(attribute.datetime) }} {{ getCurrentDayMonth(attribute.datetime) }} {{ $d(attribute.datetime, 'time') }} - {{ $n(attribute.value, 'currency') }}
            </p>
          </div>
        </base-field> 
      </div>
    </data-card>
    <base-modal
      v-model="state.isChartVisible"
      with-close-tag
      :with-actions="false"
    >
      <template #header>
        <h2>{{ state.electricData.data.attributes.title }}</h2>
        <label class="label">{{ computedChartDate }}</label>
      </template>
      <template #body>
        <div class="buttonset top-spacer-large bottom-spacer-large">
          <button class="button button--nomargin" :class="{ 'button--active': date.timeTrunc === 'daily' }" @click="fetchRealTimeElectricData('daily')">
            Diario
          </button>
          <button class="button" :class="{ 'button--active': date.timeTrunc === 'weekly' }" @click="fetchRealTimeElectricData('weekly')">
            Semanal
          </button>
          <button class="button button--nomargin" :class="{ 'button--active': date.timeTrunc === 'monthly' }" @click="fetchRealTimeElectricData('monthly')">
            Mensual
          </button>
        </div>
        <div class="insular-chart">
          <base-loader v-if="state.isLoadingChart" />
          <line-chart
            css-classes="insular-chart__chart"
            :chart-data="state.chartData"
            :chart-options="state.chartOptions"
            :height="isMobile ? 400 : 150"
          /> 
        </div>
      </template>
    </base-modal>
  </div>
</template>


<style lang="scss">
.insular {

  &__stats {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: $spacer*3;
    background: $white-color;
    padding: $spacer-half;
    border-radius: $small-radius;
    text-transform: uppercase;
  }

  &__stat {
    margin: 0;
    font-weight: $font-weight-bold;
    font-size: ms(0);

    &--danger {
      color: $danger-color;
    }

    &--warning {
      color: $warning-color;

    }

    &--success {
      color: $success-color;

    }
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
  
  &__chart-button {
    display: block;

    &--selected {
     background: $black-color;
    }
  }
}

.insular-chart {
  
  &__chart {
    height: 50vh;
  }
}
</style>
