const CSV_HEADERS = [
    'process_number',
    'number',
    'name',
    'birthdate',
    'gender',
    'photo_url',
    'academic_year_id',
    'group_id',
    'level_id',
    'sen',
    'sen_details',
    'guardian_name',
    'guardian_relationship',
    'guardian_phone',
    'guardian_email'
]

export const exportStudentsToCSV = (students = [], filename = 'students_export.csv') => {
    const rows = [CSV_HEADERS.join(',')]

    students.forEach((student) => {
        const extra = student.extra_info || {}
        const guardian = student.guardian_info || (Array.isArray(student.guardians) ? student.guardians[0] : {}) || {}

        const row = [
            `"${student.process_number || ''}"`,
            `"${student.groupNumber ?? student.number ?? ''}"`,
            `"${(student.name || '').replace(/"/g, '""')}"`,
            `"${student.birthdate || ''}"`,
            `"${student.gender || 'undefined'}"`,
            `"${(student.photo_url || '').replace(/"/g, '""')}"`,
            `"${student.academic_year_id || ''}"`,
            `"${student.group_id || student.groupId || ''}"`,
            `"${student.level_id || ''}"`,
            `"${extra.sen || extra.nee ? 'true' : 'false'}"`,
            `"${(extra.senDetails || '').replace(/"/g, '""')}"`,
            `"${(guardian.name || '').replace(/"/g, '""')}"`,
            `"${(guardian.relationship || '').replace(/"/g, '""')}"`,
            `"${(guardian.phone || guardian.phone_number || '').replace(/"/g, '""')}"`,
            `"${(guardian.email || '').replace(/"/g, '""')}"`
        ]
        rows.push(row.join(','))
    })

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export const parseStudentsCSV = (csvText) => {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0)
    if (lines.length < 2) return []

    const parseLine = (line) => {
        const result = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
                current = ''
            } else {
                current += char
            }
        }
        result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
        return result
    }

    // Normalize header keys: lowercase and convert spaces/hyphens to underscores
    const rawHeaders = parseLine(lines[0])
    const headers = rawHeaders.map((h) =>
        h.toLowerCase().trim().replace(/[\s.-]+/g, '_')
    )

    return lines.slice(1).map((line) => {
        const values = parseLine(line)
        const row = {}
        headers.forEach((h, index) => {
            row[h] = values[index] || ''
        })

        // Process number aliases
        const processNumber =
            row.process_number ||
            row.process_numer ||
            row.processnumber ||
            row.process_no ||
            row.nº_processo ||
            row.n_processo ||
            row.processo ||
            row.proc ||
            ''

        // Call number aliases
        const rawNumber =
            row.number !== undefined && row.number !== '' ? row.number :
                row.nº !== undefined && row.nº !== '' ? row.nº :
                    row.n_º !== undefined && row.n_º !== '' ? row.n_º :
                        row.group_number ||
                        row.call_number ||
                        row.numero ||
                        row.número ||
                        row.num ||
                        row.n ||
                        ''
        const parsedNumber = rawNumber !== '' && !isNaN(rawNumber) ? parseInt(rawNumber, 10) : null

        // Group, Academic Year, and Level UUID aliases
        const groupId =
            row.group_id ||
            row.groupid ||
            row.group ||
            row.turma_id ||
            row.turma ||
            null

        const academicYearId =
            row.academic_year_id ||
            row.academicyearid ||
            row.academic_year ||
            row.ano_letivo_id ||
            row.ano_letivo ||
            null

        const levelId =
            row.level_id ||
            row.levelid ||
            row.level ||
            row.ciclo_id ||
            row.nivel_id ||
            null

        // SEN boolean aliases
        const senRaw = (row.sen || row.nee || '').toLowerCase()
        const senBool = senRaw === 'true' || senRaw === '1' || senRaw === 'yes' || senRaw === 'sim'

        // Gender aliases
        const validGenders = ['male', 'female', 'undefined']
        const rawGender = (row.gender || row.genero || row.sexo || '').toLowerCase()
        const gender = rawGender === 'masculino' || rawGender === 'm'
            ? 'male'
            : rawGender === 'feminino' || rawGender === 'f'
                ? 'female'
                : validGenders.includes(rawGender)
                    ? rawGender
                    : 'undefined'

        return {
            process_number: String(processNumber).trim(),
            number: parsedNumber,
            name: String(row.name || row.nome || row.aluno || '').trim(),
            birthdate: row.birthdate || row.data_nascimento || row.data_nasc || null,
            gender,
            photo_url: row.photo_url || row.photourl || row.photo || row.foto || row.avatar || '',
            academic_year_id: academicYearId,
            group_id: groupId,
            level_id: levelId,
            extra_info: {
                sen: senBool,
                senDetails: row.sen_details || row.sendetails || row.detalhes_nee || ''
            },
            guardian_info: {
                name: row.guardian_name || row.guardianname || row.encarregado_nome || row.nome_ee || '',
                relationship: row.guardian_relationship || row.guardianrelationship || row.grau_parentesco || row.parentesco || '',
                phone: row.guardian_phone || row.guardianphone || row.telefone_ee || row.contacto_ee || row.phone || '',
                email: row.guardian_email || row.guardianemail || row.email_ee || ''
            }
        }
    }).filter((item) => item.process_number && item.name)
}