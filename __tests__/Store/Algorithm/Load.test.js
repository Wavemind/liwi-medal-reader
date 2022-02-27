import {store} from "@/Store";
import LoadAlgorithm from "@/Store/Algorithm/Load";
import algorithmFile from "../../version_1.json";

beforeAll(async () => {
    const algorithmFile = require('../../version_1.json')
})

describe('Load ePOCT+ Dynamic Tanzania algorithm', () => {
    it('should load algorithm', async () => {
        await store.dispatch(
            LoadAlgorithm.action({
                newAlgorithm: algorithmFile,
            }),
        )
        console.log(store.getState())
        expect(store.getState().algorithm.item.algorithm_name).toBe('ePOCT+ Dynamic Tanzania')
    })
})