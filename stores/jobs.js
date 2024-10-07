import { defineStore } from 'pinia';

export const useJobsStore = defineStore('jobsStore', () => {
    const jobs = ref([])

    const pushJobs = (newJobs) => {
        jobs.value = [...jobs.value, ...newJobs]
    }

    return {
        pushJobs,
        jobs
    }
})
