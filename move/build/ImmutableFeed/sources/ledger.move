module immutable_feed::ledger {
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use std::signer;

    struct LedgerEntry has key, store, copy, drop {
        id: u64,
        content_hash: String,
        author: address,
        timestamp: u64,
        previous_hash: String,
        is_deleted: bool,
        metadata: String,
    }

    struct LedgerStore has key {
        entries: vector<LedgerEntry>,
        next_id: u64,
        total_entries: u64,
    }

    #[event]
    struct EntryCreatedEvent has drop, store {
        id: u64,
        content_hash: String,
        author: address,
        timestamp: u64,
    }

    #[event]
    struct EntryModifiedEvent has drop, store {
        original_id: u64,
        new_id: u64,
        author: address,
        timestamp: u64,
    }

    const E_NOT_INITIALIZED: u64 = 1;
    const E_ENTRY_NOT_FOUND: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;

    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        
        if (!exists<LedgerStore>(account_addr)) {
            move_to(account, LedgerStore {
                entries: vector::empty<LedgerEntry>(),
                next_id: 1,
                total_entries: 0,
            });
        };
    }

    public entry fun add_entry(
        account: &signer,
        content_hash: String,
        previous_hash: String,
        metadata: String,
    ) acquires LedgerStore {
        let account_addr = signer::address_of(account);
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);

        let store = borrow_global_mut<LedgerStore>(account_addr);

        let entry = LedgerEntry {
            id: store.next_id,
            content_hash,
            author: account_addr,
            timestamp: timestamp::now_microseconds(),
            previous_hash,
            is_deleted: false,
            metadata,
        };

        vector::push_back(&mut store.entries, entry);
        store.next_id = store.next_id + 1;
        store.total_entries = store.total_entries + 1;

        0x1::event::emit(EntryCreatedEvent {
            id: entry.id,
            content_hash: entry.content_hash,
            author: account_addr,
            timestamp: entry.timestamp,
        });
    }

    public entry fun mark_deleted(
        account: &signer,
        entry_id: String,
        new_content_hash: String,
        metadata: String,
    ) acquires LedgerStore {
        let account_addr = signer::address_of(account);
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);

        let store = borrow_global_mut<LedgerStore>(account_addr);

        // Create new entry for the modification
        let new_entry = LedgerEntry {
            id: store.next_id,
            content_hash: new_content_hash,
            author: account_addr,
            timestamp: timestamp::now_microseconds(),
            previous_hash: entry_id,
            is_deleted: false,
            metadata,
        };

        vector::push_back(&mut store.entries, new_entry);
        store.next_id = store.next_id + 1;
        store.total_entries = store.total_entries + 1;

        0x1::event::emit(EntryModifiedEvent {
            original_id: 0, // simplified for now
            new_id: new_entry.id,
            author: account_addr,
            timestamp: new_entry.timestamp,
        });
    }

    #[view]
    public fun get_entries(account_addr: address): vector<LedgerEntry> acquires LedgerStore {
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);
        let store = borrow_global<LedgerStore>(account_addr);
        store.entries
    }

    #[view]
    public fun get_entry_by_id(account_addr: address, entry_id: u64): LedgerEntry acquires LedgerStore {
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);
        let store = borrow_global<LedgerStore>(account_addr);
        
        let i = 0;
        let len = vector::length(&store.entries);
        
        while (i < len) {
            let entry = vector::borrow(&store.entries, i);
            if (entry.id == entry_id) {
                return *entry
            };
            i = i + 1;
        };

        abort E_ENTRY_NOT_FOUND
    }

    #[view]
    public fun get_active_entries(account_addr: address): vector<LedgerEntry> acquires LedgerStore {
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);
        let store = borrow_global<LedgerStore>(account_addr);
        
        let active_entries = vector::empty<LedgerEntry>();
        let i = 0;
        let len = vector::length(&store.entries);
        
        while (i < len) {
            let entry = vector::borrow(&store.entries, i);
            if (!entry.is_deleted) {
                vector::push_back(&mut active_entries, *entry);
            };
            i = i + 1;
        };

        active_entries
    }

    #[view]
    public fun get_snapshot_at_time(account_addr: address, target_timestamp: u64): vector<LedgerEntry> acquires LedgerStore {
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);
        let store = borrow_global<LedgerStore>(account_addr);
        
        let snapshot = vector::empty<LedgerEntry>();
        let i = 0;
        let len = vector::length(&store.entries);
        
        while (i < len) {
            let entry = vector::borrow(&store.entries, i);
            if (entry.timestamp <= target_timestamp) {
                vector::push_back(&mut snapshot, *entry);
            };
            i = i + 1;
        };

        snapshot
    }

    #[view]
    public fun get_total_entries(account_addr: address): u64 acquires LedgerStore {
        assert!(exists<LedgerStore>(account_addr), E_NOT_INITIALIZED);
        let store = borrow_global<LedgerStore>(account_addr);
        store.total_entries
    }
}