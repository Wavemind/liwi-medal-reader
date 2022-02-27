import {store} from "@/Store";
import LoadAlgorithm from "@/Store/Algorithm/Load";
import DestroyAlgorithm from "@/Store/Algorithm/Destroy";

beforeAll(async () => {
    const algorithmFile = require('../../version_1.json')
    await store.dispatch(
        LoadAlgorithm.action({
            newAlgorithm: algorithmFile,
        }),
    )
})

describe('Destroy ePOCT+ Dynamic Tanzania algorithm', () => {
    it('should destroy algorithm', async () => {
        store.dispatch(DestroyAlgorithm.action())
        expect(store.getState().algorithm.item).toStrictEqual({})
    })
})