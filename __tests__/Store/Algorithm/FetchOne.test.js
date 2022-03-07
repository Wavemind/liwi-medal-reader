import * as redux from 'react-redux'
import { store } from '@/Store'
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'

describe('FetchOne from Algorithm', () => {
  it('FetchOne from Algorithm', async () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    const mockDispatchFn = jest.spyOn(FetchOneAlgorithm, 'action')
    useDispatchSpy.mockReturnValue(mockDispatchFn)
    FetchOneAlgorithm.action({ json_version: '1' })
    //assert
    expect(mockDispatchFn).toHaveBeenCalledWith({ json_version: '1' })
    //teardown
    useDispatchSpy.mockClear()
  })
})
