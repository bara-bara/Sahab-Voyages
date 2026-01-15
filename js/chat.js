// ============ GEMINI AI CHAT SYSTEM ============

const GEMINI_API_KEY = 'AIzaSyBG7sHHEP0fOCVxTYsMIhP0bwv2fVX-KJo';
let chatHistory = [];
let geminiModel = null;

// Initialize Gemini AI
async function initGemini() {
    try {
        if (typeof google !== 'undefined' && google.ai && google.ai.generative) {
            const genAI = new google.ai.generative_ai.GenerativeAI(GEMINI_API_KEY);
            geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
            console.log('Gemini AI initialized successfully');
            return true;
        } else {
            console.error('Gemini AI library not loaded properly');
            return false;
        }
    } catch (error) {
        console.error('Error initializing Gemini AI:', error);
        return false;
    }
}

// System prompt for the AI
const systemPrompt = `أنت "Assistant Sahab Voyages"، المساعد الذكي الرسمي لوكالة الأسفار المغربية Sahab Voyages – أسفار سحاب.

مهمتك الأساسية:
- مساعدة الزوار والإجابة على استفساراتهم
- إقناعهم بجودة خدمات الوكالة
- توجيههم دائمًا للتواصل عبر WhatsApp للتفاصيل الدقيقة والحجوزات

معلومات الوكالة:
- تذاكر الطيران والباخرة بأقل الأسعار (الخطوط المغربية، الفرنسية، التركية، السعودية، الإماراتية، العربية للطيران، ريان إير، توي فلاي، ترانزافيا)
- حجوزات الفنادق في المغرب وجميع أنحاء العالم
- رحلات سياحية منظمة (تركيا، أوروبا، آسيا)
- الحج والعمرة
- الرحلات البحرية (Croisières)
- النقل السياحي
- خدمات الفيزا
- تنظيم المعارض والمؤتمرات وTeam Building

أرقام التواصل:
☎ Fixe: 05.22.75.91.67
📲 WhatsApp: https://wa.me/212623945729
📧 Email: agencesahab@gmail.com
📍 العنوان: https://maps.app.goo.gl/Qt5k2r5CWC7WQ7Cy9

ساعات العمل:
- Lun – Jeu: 09:00 – 18:30
- Ven: 09:00 – 18:30
- Sam: 09:00 – 13:00
- Dim: Fermé

قواعد الرد:
1. أجب بالعربية أو الفرنسية حسب لغة السؤال
2. أسلوبك: احترافي، مطمئن، جذاب، تسويقي ذكي
3. لا تعطِ أسعار نهائية، بل قل "حسب التاريخ والخدمات" أو "نختلف حسب الموسم والخدمات المطلوبة"
4. استخدم هوكات خفيفة (راحة، ثقة، أفضل سعر، تنظيم احترافي)
5. في نهاية كل رد: ادعُ الزبون للتواصل عبر WhatsApp مع رابط مباشر
6. هدفك النهائي: تحويل كل محادثة إلى تواصل واتساب
7. كن مفيدًا ودقيقًا في المعلومات
8. إذا سأل عن سعر، قل أن الأسعار تختلف حسب الموسم والفترة وعدد الأشخاص، وأدعه للتواصل على الواتساب للحصول على عرض سعر دقيق

أمثلة على الردود:
- "أسعار العمرة تختلف حسب الفترة والخدمات المطلوبة. للتفاصيل الدقيقة والعروض المناسبة لك، اتصل بنا على الواتساب"
- "نحن نتعامل مع جميع شركات الطيران للحصول على أفضل الأسعار. أعطنا تفاصيل رحلتك على الواتساب وسنقدم لك أفضل عرض"
- "نقدم جميع أنواع التأشيرات. أرسل لنا جواز سفرك على الواتساب وسنخبرك بالوثائق المطلوبة والتكلفة"

ابدأ المحادثة بترحيب دافئ وعرض للمساعدة.`;

// Chat Functions
function toggleChat() {
    const win = document.getElementById('chatWindow');
    const isClosed = win.style.display !== 'flex';
    win.style.display = isClosed ? 'flex' : 'none';
    
    if (isClosed) {
        const msgs = document.getElementById('chatMsgs');
        const welcomeMessage = currentLanguage === 'fr' 
            ? `<strong>Bonjour ! 👋 Je suis l'assistant intelligent de Sahab Voyages.</strong><br><br>
               Je peux vous aider avec :<br>
               • 🕋 <strong>Omra & Hajj</strong> (programmes, informations)<br>
               • 🛂 <strong>Visas</strong> (tous les pays du Golfe)<br>
               • ✈️ <strong>Billets d'avion</strong> (meilleurs prix)<br>
               • 🏨 <strong>Réservation d'hôtels</strong><br>
               • 🌍 <strong>Voyages organisés</strong><br><br>
               <em>Posez-moi votre question et je vous guiderai vers la meilleure solution !</em>`
            : `<strong>مرحباً ! 👋 أنا المساعد الذكي لـ سفار سحاب.</strong><br><br>
               أستطيع مساعدتك في :<br>
               • 🕋 <strong>العمرة والحج</strong> (برامج، معلومات)<br>
               • 🛂 <strong>التأشيرات</strong> (جميع دول الخليج)<br>
               • ✈️ <strong>تذاكر الطيران</strong> (أفضل الأسعار)<br>
               • 🏨 <strong>حجز الفنادق</strong><br>
               • 🌍 <strong>رحلات منظمة</strong><br><br>
               <em>اطرح سؤالك وسأوجهك نحو أفضل حل !</em>`;
        
        msgs.innerHTML = `<div class="msg msg-bot">${welcomeMessage}</div>`;
        chatHistory = [];
        msgs.scrollTop = msgs.scrollHeight;
        
        // Initialize Gemini on first chat open if not already
        if (!geminiModel) {
            initGemini();
        }
    }
}

function sendQuickQuestion(question) {
    document.getElementById('userInput').value = question;
    sendUserMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
}

async function sendUserMessage() {
    const inputField = document.getElementById('userInput');
    const userText = inputField.value.trim();
    
    if (!userText) return;
    
    // Add user message to chat
    addMessageToChat(userText, 'user');
    inputField.value = '';
    inputField.focus();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Prepare the prompt for Gemini
        const userLanguage = detectLanguage(userText);
        const contextPrompt = `${systemPrompt}\n\nتاريخ المحادثة:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nالسؤال الجديد (${userLanguage}): ${userText}\n\nرد كـ Assistant Sahab Voyages (بلغة ${userLanguage}، مع دعوة للواتساب في النهاية):`;
        
        if (geminiModel) {
            // Use Gemini API
            const result = await geminiModel.generateContent(contextPrompt);
            const response = await result.response;
            const botResponse = response.text();
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add WhatsApp link to response
            const finalResponse = botResponse + 
                (currentLanguage === 'fr' 
                    ? `<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">💬 Contactez-nous sur WhatsApp</a>`
                    : `<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">💬 تواصل معنا على واتساب</a>`);
            
            addMessageToChat(finalResponse, 'bot');
            
            // Update chat history
            chatHistory.push({ role: 'user', content: userText });
            chatHistory.push({ role: 'assistant', content: botResponse });
            
            // Keep only last 10 messages
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
        } else {
            // Fallback to local response
            setTimeout(() => {
                removeTypingIndicator();
                const fallbackResponse = currentLanguage === 'fr'
                    ? `Merci pour votre question! Pour obtenir une réponse précise et personnalisée concernant "${userText}", je vous invite à contacter directement notre équipe sur WhatsApp. Ils pourront vous fournir toutes les informations détaillées et les meilleurs tarifs.<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">💬 Contactez-nous sur WhatsApp</a>`
                    : `شكراً لسؤالك! للحصول على إجابة دقيقة ومخصصة بخصوص "${userText}"، أدعوك للتواصل مباشرة مع فريقنا على واتساب. سيمكنهم تقديم جميع المعلومات التفصيلية وأفضل الأسعار لك.<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">💬 تواصل معنا على واتساب</a>`;
                
                addMessageToChat(fallbackResponse, 'bot');
            }, 1000);
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        removeTypingIndicator();
        
        const errorResponse = currentLanguage === 'fr'
            ? `Je rencontre actuellement des difficultés techniques. Pour une assistance immédiate, contactez-nous directement sur WhatsApp et notre équipe se fera un plaisir de vous aider!<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none;">💬 Contact WhatsApp</a>`
            : `أواجه بعض الصعوبات التقنية حالياً. للحصول على مساعدة فورية، اتصل بنا مباشرة على واتساب وسيكون فريقنا سعيداً بمساعدتك!<br><br><a href="https://wa.me/212623945729" target="_blank" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #25d366; color: white; border-radius: 10px; font-weight: bold; text-decoration: none;">💬 واتساب</a>`;
        
        addMessageToChat(errorResponse, 'bot');
    }
}

function addMessageToChat(text, sender) {
    const msgs = document.getElementById('chatMsgs');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg msg-${sender}`;
    msgDiv.innerHTML = text;
    msgs.appendChild(msgDiv);
    msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
    const msgs = document.getElementById('chatMsgs');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg msg-bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    msgs.appendChild(typingDiv);
    msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function detectLanguage(text) {
    // Simple language detection
    const arabicChars = /[\u0600-\u06FF]/;
    return arabicChars.test(text) ? 'العربية' : 'الفرنسية';
}

// Initialize Gemini on page load
document.addEventListener('DOMContentLoaded', function() {
    initGemini();
});
