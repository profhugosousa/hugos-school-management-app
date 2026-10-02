export const getStudentEmail = (processNumber) => {
    return processNumber ? `${processNumber.trim()}@aedonamaria.pt` : ''
}