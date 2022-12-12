#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

using namespace std;

// ----------------------------------------------------------

int main()
{

  int tbl[16]    = {0,1,2,3,4,5,6,7,8,14,20,1,1,5,14,15};
  int result[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

  atomic<int> next(0);
  
  auto func = [&tbl,&result,&next]() {
    while (1) {
      int current = next++;
      if (current >= 16) {
        return;
      }
      int f = 1;
      for (int i = 2 ; i <= tbl[current] ; ++ i) {
        f = f * i;
      }
      result[current] = f;
    }
  };

  vector<thread> ths;  
  ths.push_back(thread(func));
  ths.push_back(thread(func));
  ths.push_back(thread(func));

  for (auto& th : ths) {
    th.join();
  }

  for (int i = 0 ; i < 16 ; i++) {
    cerr << result[i] << ' ';
  }
  cerr << endl;

  // 1 1 2 6 24 120 720 5040 40320 1278945280 -2102132736 1 1 120 1278945280 2004310016

  // Ex1: create two threads, use both to compute factorial(tbl[]) => result[]
  // result[i] = factorial(tbl[i])
  
  return 0;
}

// ----------------------------------------------------------
