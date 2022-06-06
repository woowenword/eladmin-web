import request from '@/utils/request'

export function detail(user_id) {
  return request({
    url: 'api/dexuser/detail?userId=' + user_id,
    method: 'get'
  })
}

export default { detail }
