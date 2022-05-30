import request from '@/utils/request'

export function del(name) {
  return request({
    url: '/api/cross/clean?symbol=' + name,
    method: 'get'
  })
}

/**
 * 版本回退
 * @param data 选中行
 */
export function reducte(data) {
  return request({
    url: 'api/deploy/serverReduction',
    method: 'post',
    data
  })
}
