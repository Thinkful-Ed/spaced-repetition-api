class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }

    insertLast(item) {
        if (this.head === null) {
            this.insertFirst(item);
        }
        else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }

    insertBefore(item, value) {
        let newNode = new _Node(item, null);
        if (this.head.value === value || this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head;
            while (tempNode.next.value !== value) {
                tempNode = tempNode.next
            }
            newNode.next = tempNode.next;
            tempNode.next = newNode;
        }
    }

    insertAfter(item, value) {
        if (this.head === null) {
            this.insertFirst(item)
        }
        else {
            let tempNode = this.head;
            while (tempNode.value !== value) {
                tempNode = tempNode.next
            }
            let newNode = new _Node(item, tempNode.next);
            tempNode.next = newNode;
        }
    }

    insertAt(item, position) {
        if (this.head === null || position === 1) {
            this.insertFirst(item)
        }
        else {
            let currentNode = this.head
            for (let i = 1; i < position; i++) {
                if (currentNode.next === null) {
                    this.insertLast(item)
                }
                currentNode = currentNode.next
            }
            this.insertBefore(item, currentNode.value)
        }
    }

    find(item) {
        // Start at the head
        let currNode = this.head;
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // Check for the item 
        while (currNode.value !== item) {
            /* Return null if it's the end of the list 
               and the item is not on the list */
            if (currNode.next === null) {
                return null;
            }
            else {
                // Otherwise, keep looking 
                currNode = currNode.next;
            }
        }
        // Found it
        return currNode;
    }

    remove(item) {
        // If the list is empty
        if (!this.head) {
            return null;
        }
        // If the node to be removed is head, make the next node head
        if (this.head.value === item) {
            this.head = this.head.next;
            return;
        }
        // Start at the head
        let currNode = this.head;
        // Keep track of previous
        let previousNode = this.head;

        while ((currNode !== null) && (currNode.value !== item)) {
            // Save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if (currNode === null) {
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }

    display() {
        if (!this.head) {
            console.log('List is empty');
        }

        let currentNode = this.head;

        while (currentNode !== null) {
            console.log(currentNode.value);
            currentNode = currentNode.next;
        }
    }

    size() {
        if (!this.head) {
            return 0;
        }

        let currentNode = this.head;
        let size = 0;

        while (currentNode !== null) {
            size++;
            currentNode = currentNode.next;
        }

        return size;
    }

    isEmpty() {
        if (!this.head) {
            return true;
        }
        return false;
    }

    findPrevious(item) {
        let currentNode = this.head;
        let previousNode = null;

        while ((currentNode !== null) && (currentNode.value !== item)) {
            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        if (currentNode === null) {
            console.log('Target not found.');
            return null;
        }

        return previousNode;
    }

    findLast() {
        if (!this.head) {
            return null;
        }

        let currentNode = this.head;

        while (currentNode.next !== null) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }

    reverse() {
        let prevNode = null;
        let currNode = this.head;
        let nextNode = null;

        while (currNode !== null) {
            nextNode = currNode.next;
            currNode.next = prevNode;
            prevNode = currNode;
            currNode = nextNode;
        }

        this.head = prevNode;
    }

    thirdToLast() {
        let currNode = this.findLast();
        for (let i = 0; i < 2; i++) {
            currNode = this.findPrevious(currNode.value);
        }

        return currNode;
    }

    middleOfList() {
        let slowNode = this.head;
        let fastNode = this.head;
        let lastNode = this.findLast();

        while (fastNode !== null || fastNode !== lastNode) {

            if (fastNode.next.next === null) {
                return slowNode;
            }
            slowNode = slowNode.next;
            fastNode = fastNode.next.next;

        }

        return slowNode;
    }
}

module.exports = LinkedList;