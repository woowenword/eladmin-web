import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jobs',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/jobs',
    method: 'delete',
    data: ids
  })
}

export function edit(user_id) {
  return request({
    url: 'api/dexuser/detail?user_id=' + user_id,
    method: 'get'
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'put'
  })
}

export function execution(id) {
  return request({
    url: 'api/jobs/exec/' + id,
    method: 'put'
  })
}

export default { del, updateIsPause, execution, add, edit }
