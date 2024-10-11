import { defineStore } from 'pinia'
import { ref } from 'vue'
import { query, loadMore } from '../api/chat'

export const useChatStore = defineStore('chatStore', () => {
    const messages = ref([
        { text: 'Bună! Cauți o locuință nouă? Asistentul nostru AI este aici să te ajute să găsești exact ce ai nevoie. Scrie preferințele tale și să începem! 🏡✨', sender: 'bot' },
    ]);

    const prompts = ref([
        "Apartamente cu 2 dormitoare aproape de centru",
        "Case cu grădină în București",
        "Apartamente moderne în București cu parcare",
        "Proprietăți comerciale de vânzare în București",
        "Proprietăți de închiriat disponibile în București"
    ])
  
    const jobs = ref([])

    const handleSetPrompts = (newPrompts) => {
        prompts.value = newPrompts
    }

    const handleClearPrompts = () => {
        prompts.value = []
    }

    const handlePushMessage = (message) => {
        // Push new message to messages array
        messages.value.push(message);
    }

    const handleResetJobs = () => {
        jobs.value = []
    }

    const handlePushJob = (job) => {
        // Push new job to jobs array
        jobs.value.push(job);
    }

    const handlePushJobs = (newJobs) => {
        // Append new jobs to the jobs array
        jobs.value = [...jobs.value, ...newJobs];
    }

    const handleQuery = async (q = null, filters = null) => {
        try {
            const { data, error } = await query(q, filters);
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleQuery:', err);
            throw err; // Rethrow the error if needed
        }
    }

    const handleLoadMore = async () => {
        try {
            const { data, error } = await loadMore();
            if (error.value) throw new Error(error.value);
            return data.value;
        } catch (err) {
            console.error('Error in handleLoadMore:', err);
            throw err; // Rethrow the error if needed
        }
    }

    return {
        messages, jobs, prompts,
        handleSetPrompts, handleClearPrompts,
        handleQuery, handleLoadMore, 
        handlePushMessage, 
        handlePushJobs, handlePushJob, handleResetJobs
    }
})
