// Package english provides a compressed English dictionary using a WebAssembly trie.
//
// Usage:
//
//	dict, err := english.Load("english.wasm")
//	if err != nil {
//	    log.Fatal(err)
//	}
//	defer dict.Close()
//
//	suggestions := dict.Autocomplete("hel", 10)
//	isWord := dict.Contains("hello")
//
// Requirements:
//
//	go get github.com/bytecodealliance/wasmtime-go/v19
package english

import (
	"strings"

	"github.com/bytecodealliance/wasmtime-go/v19"
)

// EnglishDictionary provides access to the compressed English dictionary.
type EnglishDictionary struct {
	store    *wasmtime.Store
	instance *wasmtime.Instance
	memory   *wasmtime.Memory

	init         *wasmtime.Func
	getNodeCount *wasmtime.Func
	getResultPtr *wasmtime.Func
	autocomplete *wasmtime.Func
	contains     *wasmtime.Func
}

// Load creates a new EnglishDictionary from a WASM file.
func Load(wasmPath string) (*EnglishDictionary, error) {
	engine := wasmtime.NewEngine()
	store := wasmtime.NewStore(engine)

	module, err := wasmtime.NewModuleFromFile(engine, wasmPath)
	if err != nil {
		return nil, err
	}

	instance, err := wasmtime.NewInstance(store, module, nil)
	if err != nil {
		return nil, err
	}

	memory := instance.GetExport(store, "memory").Memory()

	dict := &EnglishDictionary{
		store:        store,
		instance:     instance,
		memory:       memory,
		init:         instance.GetFunc(store, "init"),
		getNodeCount: instance.GetFunc(store, "getNodeCount"),
		getResultPtr: instance.GetFunc(store, "getResultPtr"),
		autocomplete: instance.GetFunc(store, "autocomplete"),
		contains:     instance.GetFunc(store, "contains"),
	}

	// Initialize the trie
	_, err = dict.init.Call(store)
	if err != nil {
		return nil, err
	}

	return dict, nil
}

// Close releases resources associated with the dictionary.
func (d *EnglishDictionary) Close() {
	// wasmtime-go handles cleanup automatically
}

// NodeCount returns the number of nodes in the trie.
func (d *EnglishDictionary) NodeCount() (int, error) {
	result, err := d.getNodeCount.Call(d.store)
	if err != nil {
		return 0, err
	}
	return int(result.(int32)), nil
}

// Contains checks if a word exists in the dictionary.
func (d *EnglishDictionary) Contains(word string) (bool, error) {
	query := strings.ToLower(word)
	queryBytes := []byte(query)

	ptrResult, err := d.getResultPtr.Call(d.store)
	if err != nil {
		return false, err
	}
	ptr := int(ptrResult.(int32))

	// Write query to memory
	data := d.memory.UnsafeData(d.store)
	copy(data[ptr:], queryBytes)

	result, err := d.contains.Call(d.store, int32(ptr), int32(len(queryBytes)))
	if err != nil {
		return false, err
	}

	return result.(int32) != 0, nil
}

// Autocomplete returns suggestions for a prefix.
func (d *EnglishDictionary) Autocomplete(prefix string, maxResults int) ([]string, error) {
	query := strings.ToLower(prefix)
	queryBytes := []byte(query)

	ptrResult, err := d.getResultPtr.Call(d.store)
	if err != nil {
		return nil, err
	}
	ptr := int(ptrResult.(int32))

	// Write query to memory
	data := d.memory.UnsafeData(d.store)
	copy(data[ptr:], queryBytes)

	resultLen, err := d.autocomplete.Call(
		d.store,
		int32(ptr),
		int32(len(queryBytes)),
		int32(maxResults),
	)
	if err != nil {
		return nil, err
	}

	length := int(resultLen.(int32))
	if length == 0 {
		return []string{}, nil
	}

	// Read results from memory
	resultBytes := make([]byte, length)
	copy(resultBytes, data[ptr:ptr+length])

	resultText := string(resultBytes)
	words := strings.Split(resultText, "\n")

	// Filter empty strings
	var filtered []string
	for _, w := range words {
		if w != "" {
			filtered = append(filtered, w)
		}
	}

	return filtered, nil
}
