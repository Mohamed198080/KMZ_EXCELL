// البيانات النموذجية
const sampleData = [
    { counter: 1001, longitude: 46.6728, latitude: 24.7136, polygon: "حي النخيل" },
    { counter: 1002, longitude: 46.6752, latitude: 24.7158, polygon: "حي العليا" },
    { counter: 1003, longitude: 46.6789, latitude: 24.7182, polygon: "حي المروج" },
    { counter: 1004, longitude: 46.6815, latitude: 24.7210, polygon: "حي الورود" },
    { counter: 1005, longitude: 46.6842, latitude: 24.7235, polygon: "حي النخيل" },
    { counter: 1006, longitude: 46.6867, latitude: 24.7261, polygon: "حي العليا" },
    { counter: 1007, longitude: 46.6893, latitude: 24.7289, polygon: "حي المروج" },
    { counter: 1008, longitude: 46.6920, latitude: 24.7315, polygon: "حي الورود" },
    { counter: 1009, longitude: 46.6945, latitude: 24.7342, polygon: "حي النخيل" },
    { counter: 1010, longitude: 46.6971, latitude: 24.7368, polygon: "حي العليا" }
];

// خريطة Leaflet
let map;
let markers = [];

// تهيئة الخريطة
function initMap() {
    map = L.map('map').setView([24.7136, 46.6728], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // إضافة مضللات وهمية
    const polygons = [
        { name: "حي النخيل", coords: [[24.71, 46.67], [24.72, 46.67], [24.72, 46.69], [24.71, 46.69]] },
        { name: "حي العليا", coords: [[24.72, 46.67], [24.73, 46.67], [24.73, 46.69], [24.72, 46.69]] },
        { name: "حي المروج", coords: [[24.71, 46.69], [24.72, 46.69], [24.72, 46.71], [24.71, 46.71]] },
        { name: "حي الورود", coords: [[24.72, 46.69], [24.73, 46.69], [24.73, 46.71], [24.72, 46.71]] }
    ];
    
    polygons.forEach(poly => {
        L.polygon(poly.coords, {
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.1,
            weight: 2
        }).addTo(map).bindPopup(`<b>${poly.name}</b>`);
    });
}

// تحميل البيانات النموذجية
function loadSampleData() {
    showLoading("جاري تحميل البيانات النموذجية...");
    
    // محاكاة عملية التحميل
    setTimeout(() => {
        updateResultsTable(sampleData);
        updateMapMarkers(sampleData);
        updateStats(sampleData);
        hideLoading();
        showProcessInfo("✅ تم تحميل البيانات النموذجية بنجاح", "success");
        
        // عرض قسم النتائج
        document.getElementById('results-section').style.display = 'block';
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// تحديث جدول النتائج
function updateResultsTable(data) {
    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.counter}</td>
            <td>${item.longitude.toFixed(4)}</td>
            <td>${item.latitude.toFixed(4)}</td>
            <td>${item.polygon}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// تحديث العلامات على الخريطة
function updateMapMarkers(data) {
    // إزالة العلامات القديمة
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // إضافة علامات جديدة
    data.forEach(item => {
        const marker = L.marker([item.latitude, item.longitude])
            .addTo(map)
            .bindPopup(`<b>عداد ${item.counter}</b><br>${item.polygon}`);
        
        markers.push(marker);
    });
    
    // تكبير الخريطة لتناسب جميع العلامات
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }
}

// تحديث الإحصائيات
function updateStats(data) {
    const totalPoints = data.length;
    const linkedPoints = data.filter(item => item.polygon !== "غير مرتبط").length;
    const unlinkedPoints = totalPoints - linkedPoints;
    
    document.getElementById('total-points').textContent = totalPoints;
    document.getElementById('linked-points').textContent = linkedPoints;
    document.getElementById('unlinked-points').textContent = unlinkedPoints;
}

// معالجة البيانات
function processData() {
    const excelFile = document.getElementById('excel-file').files[0];
    const kmzFile = document.getElementById('kmz-file').files[0];
    
    // التحقق من رفع الملفات
    if (!excelFile && !document.getElementById('excel-info').textContent) {
        showProcessInfo("❌ يرجى رفع ملف Excel أو استخدام البيانات النموذجية", "error");
        return;
    }
    
    showLoading("جاري معالجة البيانات...");
    
    // محاكاة معالجة البيانات
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        document.getElementById('progress').style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // استخدام البيانات النموذجية كناتج للمعالجة
            setTimeout(() => {
                const processedData = sampleData.map(item => ({
                    ...item,
                    polygon: Math.random() > 0.1 ? item.polygon : "غير مرتبط"
                }));
                
                updateResultsTable(processedData);
                updateMapMarkers(processedData);
                updateStats(processedData);
                hideLoading();
                showProcessInfo("✅ تمت معالجة البيانات بنجاح", "success");
                
                // عرض قسم النتائج
                document.getElementById('results-section').style.display = 'block';
                document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, 300);
}

// تحميل النتائج
function downloadResults() {
    showLoading("جاري إنشاء ملف Excel...");
    
    setTimeout(() => {
        hideLoading();
        
        // محاكاة تحميل الملف
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'النتائج_المعالجة.xlsx';
        link.textContent = 'انقر لحفظ الملف';
        
        showProcessInfo("✅ تم إنشاء ملف Excel. " + link.outerHTML, "success");
    }, 2000);
}

// إظهار نموذج التحميل
function showLoading(message = "جاري المعالجة...") {
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-modal').style.display = 'flex';
    document.getElementById('progress').style.width = '0%';
}

// إخفاء نموذج التحميل
function hideLoading() {
    document.getElementById('loading-modal').style.display = 'none';
}

// عرض رسالة عملية
function showProcessInfo(message, type = "info") {
    const processInfo = document.getElementById('process-info');
    processInfo.innerHTML = message;
    processInfo.className = `process-info ${type}`;
}

// التعامل مع رفع الملفات
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الخريطة
    initMap();
    
    // عرض جزء من البيانات النموذجية في الجدول
    updateResultsTable(sampleData.slice(0, 3));
    updateStats(sampleData);
    
    // إعداد مستمعي الأحداث للملفات
    const excelFileInput = document.getElementById('excel-file');
    const kmzFileInput = document.getElementById('kmz-file');
    
    excelFileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            document.getElementById('excel-info').textContent = `تم رفع: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        }
    });
    
    kmzFileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            document.getElementById('kmz-info').textContent = `تم رفع: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        }
    });
    
    // إعداد التنقل المتنقل
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // إضافة تأثيرات عند التمرير
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        // تفعيل الروابط النشطة
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // سحب وإفلات الملفات
    const uploadBoxes = document.querySelectorAll('.upload-box');
    
    uploadBoxes.forEach(box => {
        box.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#3498db';
            this.style.backgroundColor = '#f0f8ff';
        });
        
        box.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = 'white';
        });
        
        box.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#3498db';
            this.style.backgroundColor = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                const fileInfo = this.querySelector('.file-info');
                
                if (this.id === 'excel-upload') {
                    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                        fileInfo.textContent = `تم رفع: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                        // محاكاة تعيين الملف للإدخال
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        excelFileInput.files = dataTransfer.files;
                    } else {
                        fileInfo.textContent = '❌ يرجى رفع ملف Excel فقط';
                    }
                } else if (this.id === 'kmz-upload') {
                    if (file.name.endsWith('.kmz')) {
                        fileInfo.textContent = `تم رفع: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                        // محاكاة تعيين الملف للإدخال
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        kmzFileInput.files = dataTransfer.files;
                    } else {
                        fileInfo.textContent = '❌ يرجى رفع ملف KMZ فقط';
                    }
                }
            }
        });
    });
});
