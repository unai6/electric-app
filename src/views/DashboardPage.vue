<script setup>
import { onMounted, reactive, computed } from 'vue'

import BaseLoader from '@/components/widgets/BaseLoader.vue'
import DataCard from '@/components/widgets/DataCard.vue'

// import i18n from '@/lang/i18n'
import { useToast } from 'vue-toastification'

import { Bar as BarChart } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

import axios from 'axios'
import dayjs from 'dayjs'

Chart.register(...registerables)

// const { n, d }  = i18n.global || i18n

const toast = useToast()

const state = reactive({
  balanceData: {},
  renewables: {},
  notRenewables: {},
  demand: {},
  chartOptions: {
    pointBackgroundColor: 'transparent',
    responsive: true,
    borderWidth: 3,
    legend: {
      position: 'bottom',
    },
  },
  isLoading: true,
})


const date = reactive({
  start: '',
  end: '',
  timeTrunc: 'daily',
})

const xsBreakpoint = 649 // This var will be used only in this component for the moment. Move to a config file if necessary in the future.
const isMobile = computed(() => window.innerWidth <= xsBreakpoint)

onMounted(async () => await fetchBalanceData('day'))

async function fetchBalanceData (timeTrunc) {
  switch (timeTrunc) {
    case 'day': {
      date.start = dayjs().subtract(6, 'day').format('YYYY-MM-DDTHH:MM')
      date.end =  dayjs().hour(24).format('YYYY-MM-DDTHH:MM')
    }
    break;
    case 'month': {
      date.start = dayjs().startOf('month').format('YYYY-MM-DDTHH:MM')
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
    const { data } = await axios.get(`https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=${date.start}&end_date=${date.end}&time_trunc=${timeTrunc}`)
    state.balanceData = data
    const [renewables, notRenewables, demand] = state.balanceData.included
    state.renewables = renewables
    state.notRenewables = notRenewables
    state.demand = demand
  } catch (err) {
    console.error(err)
      toast.error('Ha habido un error al procesar los datos. Por favor vuelve a intentarlo.')
  } finally {
    state.isLoading = false
  }
}


  function getCharts (energyType) {
    const datasets = energyType.map(e => ({
      label: e.attributes.title,
      data: e.attributes.values.map(att => att.value),
      borderColor: e.attributes.color,
      backgroundColor: e.attributes.color,
    }))

    console.info({
           labels: energyType.map(e => e.attributes.values.map(att => dayjs(att.datetime).format('D MMM')))[0],
      datasets,
    })

    return {
      labels: energyType.map(e => e.attributes.values.map(att => dayjs(att.datetime).format('D MMM')))[0],
      datasets,
    }
  }
</script>

<template>
  <div class="market grid grid--12cols">
    <base-loader v-if="state.isLoading" />
    <div v-else class="grid-item grid-item--6col">
      <h1>{{ state.balanceData.data.attributes.title }}</h1>
      <div>
        <data-card :title="state.renewables.type">
          <bar-chart
            css-classes="insular-chart__chart"
            :chart-data="getCharts(state.renewables.attributes.content)"
            :chart-options="state.chartOptions"
            :height="isMobile ? 400 : 150"
          />
        </data-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.market {
  width: 100%;
}
</style>