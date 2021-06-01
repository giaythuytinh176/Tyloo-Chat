"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElasticData = void 0;
const axios = require('axios');
const base = 'http://localhost:9200/robot/_doc/_search';
const getElasticData = (query) => axios.get(base, {
    params: {
        source: JSON.stringify({
            query: {
                match: {
                    title: query,
                },
            },
        }),
        source_content_type: 'application/json',
    },
});
exports.getElasticData = getElasticData;
//# sourceMappingURL=elasticsearch.js.map