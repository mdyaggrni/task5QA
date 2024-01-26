import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    vus: 1000,
    duration: '30s',
    iterations: 3500,
    thresholds: {
        'http_req_duration': ['p(95)<2000'],
    },
};
export default function () {
    // Scenario Test 1: Create User API
    const createPayload = JSON.stringify ({
        name: 'morpheus',
        job: 'leader'
    });
    const createParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const createResponse = http.post('https://reqres.in/api/users', createPayload, createParams);
    check(
        createResponse,
        {
            'response code was 201': (res) => res.status == 201,
        },
    );

    // Scenario Test 2: API Update
    const updatePayload = JSON.stringify ({
        name: 'morpheus',
        job: 'zion resident'
    });
    const updateParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const updateResponse = http.put('https://reqres.in/api/users/2', updatePayload, updateParams);
    check (
        updateResponse,
        {
            'response code was 200': (res) => res.status == 200,
        },
    );
};

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
};