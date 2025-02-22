import json
label_map={'APPSDC': 0, 'Achievements': 1, 'Admission Details': 2, 'Admissions': 3, 'Admissions Details': 4, 'Alumni': 5, 'Anti-Ragging': 6, 'CFII': 7, 'Certificates': 8, 'College Details': 9, 'Contact Information': 10, 'E-mobility': 11, 'Events': 12, 'Facilities': 13, 'Faculty': 14, 'IIC': 15, 'IQAC': 16, 'Internships': 17, 'Magazine': 18, 'NSS': 19, 'Placements': 20, 'Results': 21, 'Syllabus': 22, 'Transfer and Migration': 23}
with open("label_map.json", "w") as f:
    json.dump(label_map, f, indent=4)

print("✅ labels.json file created successfully!")