const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
    heroTitle: { type: String, default: '"Every Child Can Grow-With The Right Support"' },
    heroSubtitle: { type: String, default: 'A place for Growth. Care. Therapy. Education' },
    schoolBioTitle: { type: String, default: 'USHA SCHOOL FOR EXCEPTIONAL CHILDRENS HUBBALLI' },
    schoolBioContent: { type: String, default: 'Usha School for Exceptional Children Hubballi was established in 1991 and is managed by the Pvt. Unaided sector. It is located in an urban area within the HUBLI CITY block of the DHARWAD district of Karnataka.\n\nThe school operates in a private building with 20 classrooms dedicated to instructional purposes, all of which are in good condition. Additionally, there are 2 rooms for non-teaching activities and a separate room designated for the Head master/Teacher.\n\nFunctional tap water is the primary source of drinking water. The school maintains 6 functional toilets for boys and 6 functional toilets for girls, ensuring a healthy and safe environment for all students.' },
    contactEmail: { type: String, default: 'contact@ushapublicschool.com' },
    contactPhone: { type: String, default: '+123 456 7890' },
    contactAddress: { type: String, default: '123 Learning Lane, Cityville' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeContent', homeContentSchema);
