// تهيئة المشهد ثلاثي الأبعاد
let scene, camera, renderer, brain;

function init3DBrain() {
    // إنشاء المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // إنشاء الكاميرا
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // إنشاء العارض
    const container = document.getElementById('brain-3d-container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    // إضافة الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // تحميل نموذج الدماغ
    const loader = new THREE.GLTFLoader();
    loader.load(
        'assets/images/brain-model.glb',
        function (gltf) {
            brain = gltf.scene;
            brain.scale.set(1.5, 1.5, 1.5);
            scene.add(brain);
            
            // جعل النموذج قابل للتدوير بالسحب
            const draggable = new THREE.DragControls([brain], camera, renderer.domElement);
            
            // إضافة تأثيرات عند النقر
            draggable.addEventListener('dragstart', function (event) {
                event.object.material.emissive.set(0x888888);
            });
            
            draggable.addEventListener('dragend', function (event) {
                event.object.material.emissive.set(0x000000);
            });
        },
        undefined,
        function (error) {
            console.error('حدث خطأ في تحميل نموذج الدماغ:', error);
            
            // عرض صورة بديلة إذا فشل تحميل النموذج 3D
            const container = document.getElementById('brain-3d-container');
            container.innerHTML = '<img src="assets/images/brain-3d.png" alt="الدماغ البشري" style="width:100%;height:100%;object-fit:cover;">';
        }
    );
    
    // جعل النموذج يدور تلقائياً
    function animate() {
        requestAnimationFrame(animate);
        
        if (brain) {
            brain.rotation.x += 0.005;
            brain.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // تعديل الحجم عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

// تأثيرات GSAP للانتقالات
function initAnimations() {
    // تأثيرات الهيدر
    gsap.to('.animate-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    gsap.to('.animate-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1,
        ease: 'power3.out'
    });
    
    // تأثيرات عند التمرير
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // تأثيرات الخريطة الذهنية
    const branches = document.querySelectorAll('.mindmap-branch');
    
    branches.forEach((branch, index) => {
        gsap.from(branch, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: '.mindmap-container',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// رسم خطوط الخريطة الذهنية
function drawMindmapConnections() {
    const container = document.querySelector('.mindmap-container');
    const center = document.querySelector('.mindmap-center');
    const branches = document.querySelectorAll('.mindmap-branch');
    const connector = document.querySelector('.mindmap-connector');
    
    if (!container || !center || branches.length === 0 || !connector) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '0';
    
    connector.appendChild(svg);
    
    const centerRect = center.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const centerX = centerRect.left - containerRect.left + centerRect.width / 2;
    const centerY = centerRect.top - containerRect.top + centerRect.height / 2;
    
    branches.forEach(branch => {
        const branchRect = branch.getBoundingClientRect();
        const branchX = branchRect.left - containerRect.left + branchRect.width / 2;
        const branchY = branchRect.top - containerRect.top + branchRect.height / 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', branchX);
        line.setAttribute('y2', branchY);
        line.setAttribute('stroke', '#8f94fb');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(line);
        
        // تأثيرات للخطوط
        gsap.from(line, {
            attr: { 'stroke-dashoffset': 100 },
            duration: 1,
            delay: 0.5,
            scrollTrigger: {
                trigger: '.mindmap-container',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// تهيئة كل شيء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    init3DBrain();
    initAnimations();
    drawMindmapConnections();
    
    // تنعيم التمرير
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 70,
                        autoKill: false
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });
});
