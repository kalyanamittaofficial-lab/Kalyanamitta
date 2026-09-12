const fs = require('fs');
let content = fs.readFileSync('src/pages/Register.jsx', 'utf-8');

const regex = /<label style=\{labelStyle\}>(.*?)<\/label>\s*(<input[^>]*name=["']([a-zA-Z]+)["'][^>]*>|<select[^>]*name=["']([a-zA-Z]+)["'][^>]*>)/g;

content = content.replace(regex, (match, labelText, tag, name1, name2) => {
    const name = name1 || name2;
    const acMap = {
        'email': 'email',
        'password': 'new-password',
        'name': 'name',
        'mobile': 'tel',
        'country': 'country',
        'otherCountry': 'country-name',
        'state': 'address-level1',
        'language': 'language',
        'dob': 'bday',
        'maritalStatus': 'off',
        'familyDetails': 'off',
        'education': 'off'
    };
    const ac = acMap[name] || 'off';
    
    const newLabel = `<label htmlFor="${name}" style={labelStyle}>${labelText}</label>`;
    let newTag;
    if (tag.includes('<input')) {
        newTag = tag.replace('<input ', `<input id="${name}" autoComplete="${ac}" `);
    } else {
        newTag = tag.replace('<select ', `<select id="${name}" autoComplete="${ac}" `);
    }
    return newLabel + '\n                  ' + newTag;
});

fs.writeFileSync('src/pages/Register.jsx', content);
console.log('Fixed Register.jsx successfully.');
