const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service role key
const supabaseUrl = 'https://avumdybwfgecunwbjtlj.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dW1keWJ3ZmdlY3Vud2JqdGxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkzMDE5NywiZXhwIjoyMDc0NTA2MTk3fQ.BMd4TcTKEFwdbnC68JNRMUY-pFRGNeGVkli5_dKVNrs'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestData() {
  try {
    console.log('🔍 Checking for existing users...')

    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) {
      console.error('❌ Error fetching users:', usersError)
      return
    }

    if (!users || users.users.length === 0) {
      console.log('❌ No users found. Please create a user account first.')
      return
    }

    const user = users.users[0] // Use the first user
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`)

    // Check if test documents already exist
    const { data: existingDocs, error: docsError } = await supabase
      .from('documents')
      .select('id, title')
      .eq('user_id', user.id)

    if (docsError) {
      console.error('❌ Error checking documents:', docsError)
      return
    }

    let doc1, doc2, doc3

    if (existingDocs && existingDocs.length >= 3) {
      console.log('✅ Test documents already exist')
      doc1 = existingDocs[0]
      doc2 = existingDocs[1]
      doc3 = existingDocs[2]
    } else {
      console.log('📄 Creating test documents...')

      // Create test documents
      const { data: newDocs, error: insertDocsError } = await supabase
        .from('documents')
        .insert([
          {
            user_id: user.id,
            title: 'Sample Book 1.pdf',
            file_path: 'documents/sample1.pdf',
            page_count: 100,
            pages_read: 30,
            reading_progress: 30.0,
            last_read_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            user_id: user.id,
            title: 'Sample Book 2.pdf',
            file_path: 'documents/sample2.pdf',
            page_count: 50,
            pages_read: 15,
            reading_progress: 30.0,
            last_read_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 min ago
          },
          {
            user_id: user.id,
            title: 'Research Paper.pdf',
            file_path: 'documents/research.pdf',
            page_count: 20,
            pages_read: 5,
            reading_progress: 25.0,
            last_read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          }
        ])
        .select()

      if (insertDocsError) {
        console.error('❌ Error creating documents:', insertDocsError)
        return
      }

      doc1 = newDocs[0]
      doc2 = newDocs[1]
      doc3 = newDocs[2]
      console.log('✅ Created test documents')
    }

    // Check if reading sessions already exist
    const { data: existingSessions, error: sessionsError } = await supabase
      .from('reading_sessions')
      .select('id')
      .eq('user_id', user.id)

    if (sessionsError) {
      console.error('❌ Error checking sessions:', sessionsError)
      return
    }

    if (existingSessions && existingSessions.length > 0) {
      console.log('✅ Reading sessions already exist')
      return
    }

    console.log('📖 Creating test reading sessions...')

    // Create reading sessions
    const now = new Date()
    const sessions = [
      // Session 1: Today, 15 minutes, Book 1
      {
        user_id: user.id,
        document_id: doc1.id,
        started_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        ended_at: new Date(now.getTime() - 1.75 * 60 * 60 * 1000).toISOString(), // 1h 45min ago
        page_start: 1,
        page_end: 10
      },
      // Session 2: Today, 30 minutes, Book 2
      {
        user_id: user.id,
        document_id: doc2.id,
        started_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        ended_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 min ago
        page_start: 1,
        page_end: 15
      },
      // Session 3: Yesterday, 20 minutes, Book 1
      {
        user_id: user.id,
        document_id: doc1.id,
        started_at: new Date(now.getTime() - (24 + 2) * 60 * 60 * 1000).toISOString(), // Yesterday 2h ago
        ended_at: new Date(now.getTime() - (24 + 1.67) * 60 * 60 * 1000).toISOString(), // Yesterday 1h 40min ago
        page_start: 11,
        page_end: 20
      },
      // Session 4: 2 days ago, 10 minutes, Research Paper
      {
        user_id: user.id,
        document_id: doc3.id,
        started_at: new Date(now.getTime() - (48 + 1) * 60 * 60 * 1000).toISOString(), // 2 days ago 1h ago
        ended_at: new Date(now.getTime() - (48 + 0.83) * 60 * 60 * 1000).toISOString(), // 2 days ago 50min ago
        page_start: 1,
        page_end: 5
      },
      // Session 5: 7 days ago, 25 minutes, Book 1 (for streak testing)
      {
        user_id: user.id,
        document_id: doc1.id,
        started_at: new Date(now.getTime() - (7 * 24 + 2) * 60 * 60 * 1000).toISOString(), // 7 days ago 2h ago
        ended_at: new Date(now.getTime() - (7 * 24 + 1.58) * 60 * 60 * 1000).toISOString(), // 7 days ago 1h 35min ago
        page_start: 21,
        page_end: 30
      }
    ]

    const { data: newSessions, error: insertSessionsError } = await supabase
      .from('reading_sessions')
      .insert(sessions)
      .select()

    if (insertSessionsError) {
      console.error('❌ Error creating sessions:', insertSessionsError)
      return
    }

    console.log(`✅ Created ${newSessions.length} test reading sessions`)
    console.log('🎉 Test data creation complete!')
    console.log('\n📊 Expected Dashboard Metrics:')
    console.log('- Total Time: ~100 minutes')
    console.log('- This Week: ~45 minutes (3 sessions)')
    console.log('- Documents: 3 total')
    console.log('- Active Days: 3/7 (today, yesterday, 7 days ago)')
    console.log('- Current Streak: 2 days (today + yesterday)')
    console.log('- Longest Streak: 2 days')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createTestData()