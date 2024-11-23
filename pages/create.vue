<template>
    <div>
        <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 class="text-2xl font-bold mb-4">Modifică oferta</h1>
            <p class="text-gray-600 mb-6">Urmează paşii, e mai simplu ca niciodată</p>

            <!-- Property Type -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tip proprietate</label>
                <div class="flex gap-4">
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Apartament</button>
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Casă</button>
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Teren</button>
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Comercial</button>
                </div>
            </div>

            <!-- Transaction Type -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tip tranzacție</label>
                <div class="flex gap-4">
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">De vânzare</button>
                    <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">De închiriat</button>
                </div>
            </div>

            <!-- Title -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Titlu anunț</label>
                <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="apartament de vizare 2 camere acum">
                <p class="text-sm text-gray-500">46 car.</p>
            </div>

            <!-- Image Upload -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Imagini</label>
                <input type="file" class="mt-1 block w-full text-gray-600">
                <p class="text-sm text-gray-500 mt-2">Trage imaginea în poziţia dorită pentru a schimba ordinea</p>
                <div class="mt-4">
                    <img src="" alt="Property"
                        class="w-32 h-32 object-cover rounded">
                    <button class="mt-2 text-red-500 text-sm">Remove</button>
                    <button class="mt-2 ml-4 text-blue-500 text-sm">Edit</button>
                </div>
            </div>

            <!-- Rooms and Other Details -->
            <div class="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nr. camere</label>
                    <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5+</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Compartimentare</label>
                    <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option>Alege</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Etaj</label>
                    <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        placeholder="Etaj 7">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Suprafață utilă</label>
                    <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="mp">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Preț</label>
                    <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        placeholder="22222 €">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Comision cumpărator</label>
                    <div class="flex items-center gap-4 mt-1">
                        <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Nu</button>
                        <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Da</button>
                    </div>
                </div>
            </div>

            <!-- Contact Details -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Localizare</label>
                <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Bulevardul Unirii, 8, Unirii, Sector 3">
                <p class="text-sm text-gray-500">Auto-localizare lipsă</p>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Persoana de contact</label>
                <div class="grid grid-cols-2 gap-4">
                    <input type="email" class="block w-full rounded-md border-gray-300 shadow-sm" placeholder="Email">
                    <input type="text" class="block w-full rounded-md border-gray-300 shadow-sm" placeholder="Telefon">
                </div>
            </div>

            <!-- Submit Button -->
            <button
                class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Continuă</button>
        </div>

    </div>
</template>